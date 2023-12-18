<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const handleBack = () => {
	router.back();
}
</script>

<template>
	<v-toolbar>
		<v-toolbar-title>
			直播课堂
		</v-toolbar-title>
	</v-toolbar>
	<v-container>
		<v-card>
			<v-card-title class="d-flex ga-3">
				课程包信息
				<v-spacer/>
				<v-btn
						variant="outlined"
						@click="handleBack"
				>
					取消
				</v-btn>
				<v-btn color="primary" variant="elevated">
					确认创建
				</v-btn>
			</v-card-title>

			<v-container>
				<v-row>
					<v-col cols="6">
						<v-form>
							<v-text-field
									label="名称"
							>
							</v-text-field>
						</v-form>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</v-container>
</template>

<style lang="scss" scoped>

</style>
