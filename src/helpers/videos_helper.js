import { get } from "./api_helper"
import * as url from "./url_helper"


export const getVideos = async () => {
  return await get(url.GET_VIDEOS)
  // await Post('http://localhost:8080/api/v1/upload-video', data)
}

