import { get, post } from "./api_helper"
import * as url from "./url_helper"


export const getChoiceCount = async data => {
    let query = `?tree_id=${data.tree_id}`
    return await get(url.GET_CHOICE_COUNT + query, {}, 'tree-server')
}

