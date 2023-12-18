import {defineComponent, reactive, ref, watch} from 'vue';
import {
	VBreadcrumbs,
	VBtn,
	VCard,
	VCardTitle,
	VCol,
	VContainer,
	VForm,
	VIcon,
	VList,
	VListItem,
	VListItemSubtitle,
	VListItemTitle,
	VRow,
	VSelect,
	VSheet,
	VSpacer,
	VTextarea,
	VTextField,
	VToolbar
} from "vuetify/components";
import {useCourse} from "@/composables/useCourse";
import {useRouter} from "vue-router";
import moment from "moment/moment";
import {isEqual} from "lodash-es";
import {useSnackbar} from "@/store/snackbar";
import CourseInfoModal from "@/components/CourseInfoModal";
import {setPackCourse} from '@/api/classroom';
import {createFormData} from '@/utils/tool';
import './style/index.scss';

const MIN_HEIGHT = 290;
const courses = ref([]);

const formItems = ref({
	title: '',
	description: '',
	tags: [],
	courses
});
const courseData = reactive({
	title: '',
	tags: [],
	start_time: '',
	end_time: '',
	students: [],
	attachments: [],
	cost: '0'
});

const resetCourseData = () => {
	courseData.title = '';
	courseData.tags = [];
	courseData.start_time = '';
	courseData.end_time = '';
	courseData.students = [];
	courseData.attachments = [];
	courseData.cost = '0';
}

const showModal = ref(false);
const isEditIndex = ref(null);

const checkOverlapTime = (newItem, existingItems, editIndex) => {
	let isOverlap = false;
	existingItems.forEach((item, index) => {
		if (index !== editIndex &&
				moment(newItem.start_time).isSameOrBefore(moment(item.end_time)) &&
				moment(newItem.end_time).isSameOrAfter(moment(item.start_time))) {
			isOverlap = true;
			return false;
		}
	});
	return isOverlap;
}

const CourseLists = () => {
	const transferTime = ({start_time, end_time}) => {
		if (!start_time || !end_time) return '';
		const start = moment(start_time).format('HH:mm');
		const end = moment(end_time).format('HH:mm');
		const date = moment(start_time).format('MM月DD日');
		return `${date} ${start}-${end} 开课`
	}

	const handleRemove = (item) => {
		courses.value = [
			...courses.value.filter(el => !isEqual(el, item))
		]
	}

	const handleEdit = (item, index) => {
		showModal.value = true
		Object.assign(courseData, item)
		isEditIndex.value = index
	}

	const handleCopy = (item) => {
		showModal.value = true
		Object.assign(courseData, item)
	}

	return (
			<VList lines={'two'}>
				{
					courses.value.map((el, index) =>
							<VListItem
									class={'mb-2'}
									rounded={'lg'}
									variant={'outlined'}
							>
								{
									{
										default: () => (
												<>
													<VListItemTitle class={'text-h6'}>
														{el.title}
													</VListItemTitle>
													<VListItemSubtitle class={'d-flex align-center ga-3'}>
														<div>
															{transferTime(el)}
														</div>
														<span>
                        <VIcon
		                        class={'mr-1'}
		                        icon={'mdi-account-multiple-outline'}
		                        size={16}
                        />
															{el.students?.length ?? 0}
                      </span>

														<span>
                        <VIcon
		                        class={'mr-1'}
		                        icon={'mdi-text-box-multiple-outline'}
		                        size={16}
                        />
															{el.attachments?.length ?? 0}
                      </span>
													</VListItemSubtitle>
												</>
										),
										append: () => (
												<div class={'d-flex align-center gap-2'}>
													<VBtn
															variant={'text'}
															icon
															onClick={() => handleEdit(el, index)}
													>
														<VIcon icon={'mdi-pencil'}/>
													</VBtn>
													<VBtn
															variant={'text'}
															icon
															onClick={() => handleCopy(el)}
													>
														<VIcon icon={'mdi-content-copy'}/>
													</VBtn>
													<VBtn
															variant={'text'}
															icon
															onClick={() => handleRemove(el)}
													>
														<VIcon icon={'mdi-delete-outline'}/>
													</VBtn>
												</div>
										)
									}
								}
							</VListItem>
					)
				}
			</VList>
	)
}

const Courses = ({onCreate}) => (
		<>
			<div class={'d-flex align-center justify-space-between mb-2'}>
				<div class={'text-h6'}>
					课程
				</div>
				<VBtn
						variant={'text'}
						onClick={onCreate}
				>
					<VIcon icon={'mdi-plus'}/>
					添加课程
				</VBtn>
			</div>

			<VSheet min-height={MIN_HEIGHT}>
				{
					courses.value.length === 0 ?
							(
									<div class={'d-flex align-center justify-center create-pack-container'}>
										<div class={'text-h6'}>
											暂无内容
										</div>
									</div>
							) :
							<CourseLists/>
				}
			</VSheet>
		</>
)


export const CreatePack = defineComponent({
	name: 'CreatePack',
	setup() {
		const {showSnackbar} = useSnackbar();
		const {tags} = useCourse();
		const router = useRouter();
		const formRef = ref(null);
		const courseModalRef = ref(null);

		watch(() => showModal.value, (visible) => {
			if (!visible) {
				isEditIndex.value = null;
				resetCourseData();
			}
		})

		const handleCreate = (item) => {
			try {
				const editIndex = (isEditIndex.value !== 0 && !isEditIndex.value) ? null : isEditIndex.value;

				if (checkOverlapTime(item, courses.value, editIndex)) {
					showSnackbar({
						color: 'error',
						message: '课程时间发生重叠，请重新选择时间范围！'
					})
					return
				}

				if (isEditIndex.value !== 0 && !isEditIndex.value) {
					courses.value.push({
						...item
					})
				} else {
					courses.value.splice(isEditIndex.value, 1, {...item})
				}

				setTimeout(() => {
					showModal.value = false
				}, 200)
			} catch (e) {
				console.log(e, 'e..')
			}
		}

		const handleSubmit = async () => {
			try {
				const transformCourse = formItems.value.courses.map(el => {
					return {
						...el,
						tags: [],
						students: JSON.stringify(el.students) || [], // 确保 students 存在，如果不存在则设为 []
						attachments: JSON.stringify(el.attachments) || [], // 确保 attachments 存在，如果不存在则设为 []
						course_no: "0",
						cost: 0
					}
				})

				const params = createFormData({
					...formItems.value,
					courses: transformCourse
				})
				const {data} = await setPackCourse({
					data: params,
					pack_no: 0
				})
				if (data.value.code === 'ok') {
					courses.value = []
					formItems.value = {
						title: '',
						description: '',
						tags: [],
						courses: ref([])
					}
					router.push({
						name: 'Dashboard'
					});

				}
			} catch (e) {
				console.log(e, '创建课程包发生错误')
			}
		}

		const handleBack = () => {
			router.back();
			formItems.value = {
				title: '',
				description: '',
				tags: [],
				courses: ref([])
			}
		}
		const handleModal = () => {
			console.log(courseModalRef, 'courseModalRef..')
			courseModalRef.value?.handleResetFields()
			showModal.value = true
		}

		const breadcrumbItems = [
			{
				title: '直播课堂',
				disabled: false,
				href: '/dashboard'
			},
			{
				title: '创建课程包',
				disabled: true,
				href: '/create-pack'
			}
		]
		return () => (
				<>
					<VToolbar
							color={'#010101'}
					>
						<VBreadcrumbs
								items={breadcrumbItems}
								divider=">"
						>
						</VBreadcrumbs>
					</VToolbar>
					<VContainer>
						<VCard>
							<VCardTitle class={'d-flex ga-3 px-10'}>
              <span class={'font-weight-bold'}>
                课程包信息
              </span>
								<VSpacer/>
								<VBtn
										variant={'outlined'}
										onClick={handleBack}
								>
									取消
								</VBtn>
								<VBtn
										variant={'elevated'}
										color={'primary'}
										onClick={handleSubmit}
								>
									确认创建
								</VBtn>
							</VCardTitle>
							<VContainer class={'px-10'}>
								<VRow>
									<VCol cols={8}>
										<VForm
												ref={
													(el) => {
														formRef.value = el;
													}
												}
										>
											<VTextField
													label={'名称'}
													v-model={formItems.value.title}
											>
											</VTextField>
											<VSelect
													v-model={formItems.value.tags}
													chips
													clearable
													label={'选择类型'}
													multiple
													density={'compact'}
													variant={'outlined'}
													items={tags.value}
											/>


											<VRow>
												<VCol>
													<VTextarea
															v-model={formItems.value.description}
															counter
															label={'简介'}
															variant={'outlined'}
													>
													</VTextarea>
												</VCol>
											</VRow>
										</VForm>

										<Courses
												onCreate={handleModal}
										/>
									</VCol>
								</VRow>
							</VContainer>
						</VCard>
					</VContainer>

					<CourseInfoModal
							ref={el => courseModalRef.value = el}
							v-model={showModal.value}
							data={courseData}
							onClick:submit={handleCreate}
					/>
				</>
		)
	}
})
