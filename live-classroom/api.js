import { getLocal } from "@/utils/localStorage";
import axios from "axios";
import qs from "qs";

const baseURL = import.meta.env.VITE_APP_BASE_URL;
const appId = import.meta.env.VITE_APP_ID;

const token = getLocal('token')
const request = axios.create({
	baseURL,
	headers: {
		token
	}
})
export const setLiveStatus = ({ course_no, data }) => {
	return request({
		url: `/live/${course_no}/sync-status`,
		method: 'POST',
		data: qs.stringify(data),
	})
}


/**
 * 课堂状态，可以设置为以下值：
 * 0: 未开始。
 * 1: 开始。
 * 2: 结束。课堂时间结束，但在拖堂时间内，用户可以加入课堂和在课堂内逗留。
 * 3: 关闭。拖堂时间结束，课堂关闭，所有用户被踢出并无法再进入。
 * **/
export const kickOutAll = (
		{
			roomUuid,
			state,
			token
		}
) => {
	return axios.put(
			`https://api.sd-rtn.com/cn/edu/apps/${appId}/v2/rooms/${roomUuid}/states/${state}`,
			{},
			{
				headers: {
					Authorization: `agora token=${token}`
				}
			})
}
