import { isFunction } from "lodash-es";
import { setLiveStatus } from "./api";
import { getSession } from "@/utils/sessionStorage";

const { roomUuid } = getSession('classroomInfo')

const AgoraEduSDK = window.AgoraEduSDK
const handleFailedToJoin = () => {
	console.log('加入房间失败')
}

const handleDestroyed = async () => {
	await setLiveStatus({
		course_no: roomUuid,
		data: {
			live_status: 'finish'
		}
	})
	window.close()
}

const handleReady = async evt => {
	if (evt === 1) {
		// do something when classroom is connected
		AgoraEduSDK.setRecordReady();
		await setLiveStatus({
			course_no: roomUuid,
			data: {
				live_status: 'start'
			}
		})
		console.log(`${roomUuid}}教室已连接`)
	}
}

const handleClassStateChanged = async (evt, args) => {
	console.log(args, '!!!!!!args!!!!!!!')
}

const keyValue = {
	1: handleReady, // 进入教室成功。
	2: handleDestroyed, // 教室已销毁。
	3: handleFailedToJoin, // 进入教室失败。
	101: "handleKickOut", // 被踢出房间。
	102: "handleTeacherTurnOnMyMic", // 老师开启您的麦克风。
	103: "handleTeacherTurnOffMyMic", // 老师关闭您的麦克风。
	106: "handleUserAcceptToStage", // 登上讲台。
	107: "handleUserLeaveStage", // 离开讲台。
	108: "handleRewardReceived", // 收到奖励。
	109: "handleTeacherTurnOnMyCam", // 老师开启您的摄像头。
	110: "handleTeacherTurnOffMyCam", // 老师关闭您的摄像头。
	111: "handleCurrentCamUnplugged", // 当前摄像头没有插入。
	112: "handleCurrentMicUnplugged", // 当前麦克风没有插入。
	113: "handleCurrentSpeakerUnplugged", // 当前扬声器没有插入。
	114: "handleCaptureScreenPermissionDenied", // 屏幕录制权限被拒绝。
	117: "handleBatchRewardReceived", // 收到批量奖励。
	118: "handleInvitedToGroup", // 收到邀请进入小组。
	119: "handleMoveToOtherGroup", // 被移动到其他小组。
	120: "handleJoinSubRoom", // 加入分组。
	121: "handleLeaveSubRoom", // 离开分组。
	122: "handleAcceptedToGroup", // 用户接受加入小组。
	123: "handleUserJoinGroup", // 其他用户加入小组。
	124: "handleUserLeaveGroup", // 其他用户离开小组。
	125: "handleRejectedToGroup", // 用户拒绝加入小组。
	201: "handleRTCStateChanged", // RTC 连接状态更改。
	202: handleClassStateChanged // 教室状态更改。
}


export const ListenerCallback = async (evt, args) => {
	try {
		console.log(evt, 'evt')
		console.log(args, args)
		const fn = keyValue[evt]

		if (!isFunction(fn)) return

		await fn(evt, args)
	} catch (e) {
		console.log(e, '直播内容报错')
	}
}

export const getAssetURL = relativeURL => {
	return `/assets/${relativeURL}`;
};
