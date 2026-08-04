import axios from "axios"
import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user")
  if (user) return JSON.parse(user)
  return null
}

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null
}

// Register Method
const postFakeRegister = data => {
  return axios
    .Post(url.POST_FAKE_REGISTER, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      let message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

// Login Method
const postFakeLogin = data => Post(url.POST_FAKE_LOGIN, data)

// postForgetPwd
const postFakeForgetPwd = data => Post(url.POST_FAKE_PASSWORD_FORGET, data)

// Edit profile
const postJwtProfile = data => Post(url.POST_EDIT_JWT_PROFILE, data)

const postFakeProfile = data => Post(url.POST_EDIT_PROFILE, data)

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .Post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      var message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

// Login Method
const postJwtLogin = data => Post(url.POST_FAKE_JWT_LOGIN, data)

// postForgetPwd
const postJwtForgetPwd = data => Post(url.POST_FAKE_JWT_PASSWORD_FORGET, data)

// postSocialLogin
export const postSocialLogin = data => Post(url.SOCIAL_LOGIN, data)

// get Products
export const getProducts = () => Get(url.GET_PRODUCTS)

// get Product detail
export const getProductDetail = id =>
  Get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } })

// get Events
export const getEvents = () => Get(url.GET_EVENTS)

// add Events
export const addNewEvent = event => Post(url.ADD_NEW_EVENT, event)

// update Event
export const updateEvent = event => Put(url.UPDATE_EVENT, event)

// delete Event
export const deleteEvent = event =>
  Delete(url.DELETE_EVENT, { headers: { event } })

// get Categories
export const getCategories = () => Get(url.GET_CATEGORIES)

// get chats
export const getChats = () => Get(url.GET_CHATS)

// get groups
export const getGroups = () => Get(url.GET_GROUPS)

// get Contacts
export const getContacts = () => Get(url.GET_CONTACTS)


// get messages
export const getMessages = (roomId = "") =>
  Get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } })

// post messages
export const addMessage = message => Post(url.ADD_MESSAGE, message)

// get orders
export const getOrders = () => Get(url.GET_ORDERS)

// add order
export const addNewOrder = order => Post(url.ADD_NEW_ORDER, order)

// update order
export const updateOrder = order => Put(url.UPDATE_ORDER, order)

// delete order
export const deleteOrder= order =>
  Delete(url.DELETE_ORDER, { headers: { order } })  
  
// get cart data
export const getCartData = () => Get(url.GET_CART_DATA)

// get customers
export const getCustomers = () => Get(url.GET_CUSTOMERS)

// add CUSTOMER
export const addNewCustomer = customer => Post(url.ADD_NEW_CUSTOMER, customer)

// update CUSTOMER
export const updateCustomer = customer => Put(url.UPDATE_CUSTOMER, customer)

// delete CUSTOMER
export const deleteCustomer= customer =>
  Delete(url.DELETE_CUSTOMER, { headers: { customer } })  

// get shops
export const getShops = () => Get(url.GET_SHOPS)

// get wallet
export const getWallet = () => Get(url.GET_WALLET)

// get crypto order
export const getCryptoOrder = () => Get(url.GET_CRYPTO_ORDERS)

// get invoices
export const getInvoices = () => Get(url.GET_INVOICES)

// get invoice details
export const getInvoiceDetail = id =>
  Get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } })

// get project
export const getProjects = () => Get(url.GET_PROJECTS)

// get project details
export const getProjectsDetails = id =>
  Get(`${url.GET_PROJECT_DETAIL}/${id}`, { params: { id } })

// get tasks
export const getTasks = () => Get(url.GET_TASKS)

// get contacts
export const getUsers = () => Get(url.GET_USERS)

// add user
export const addNewUser = user => Post(url.ADD_NEW_USER, user)

// update user
export const updateUser = user => Put(url.UPDATE_USER, user)

// delete user
export const deleteUser = user =>
  Delete(url.DELETE_USER, { headers: { user } })
  
/** PROJECT */
// add user
export const addNewProject = project => Post(url.ADD_NEW_PROJECT, project)

// update user
export const updateProject = project => Put(url.UPDATE_PROJECT, project)

// delete user
export const deleteProject= project =>
  Delete(url.DELETE_PROJECT, { headers: { project } })  

export const getUserProfile = () => Get(url.GET_USER_PROFILE)

// get inboxmail
export const getInboxMails = () => Get(url.GET_INBOX_MAILS)

// add inboxmail
export const addNewInboxMail = inboxmail => Post(url.ADD_NEW_INBOX_MAIL, inboxmail)

// delete inboxmail
export const deleteInboxMail = inboxmail =>
  Delete(url.DELETE_INBOX_MAIL, { headers: { inboxmail } })

// get starredmail
export const getStarredMails = () => Get(url.GET_STARRED_MAILS)

// get importantmail
export const getImportantMails = () => Get(url.GET_IMPORTANT_MAILS)

// get sent mail
export const getSentMails = () => Get(url.GET_SENT_MAILS)

// get trash mail
export const getTrashMails = () => Get(url.GET_TRASH_MAILS)

// get starredmail
export const getDraftMails = () => Get(url.GET_DRAFT_MAILS)

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
}
