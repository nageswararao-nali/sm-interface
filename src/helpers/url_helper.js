//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"
export const CHECK_USER = "/users/checkUser"
export const CHECK_USER_SUCCESS="/users/sendOtp"
export const LOGIN_USER ="/users/verifyOtp"

// UPLOAD VIDEO
export const UPLOAD_VIDEO = "/upload-video"

// VIDEOS
export const GET_VIDEOS = "/videos"

// TREES
export const GET_TREES = "/trees"
export const GET_ALL_TREES = "/treedetails"
export const ADD_TREE = "/tree/save"
export const ADD_UPLOAD_TREE = "/tree/uploadasexcel"
export const UPDATE_TREE = "/tree/editinboundtext"
export const DEACTIVATE_TREE = "/tree/deactivate"
export const ACTIVATE_TREE = "/tree/activate"
export const UPLOAD_BATCH_FILE = "/msgbatch/upload"

// BOT INSTANCES
export const GET_BOT_INSTANCES = "/botinstance/list"
export const ADD_BOT_INSTANCE = "/botinstance/add"
export const UPDATE_BOT_INSTANCE = "/botinstance/update"
export const DELETE_BOT_INSTANCE = "/botinstance/deactivate"

// BATCH MESSAGES
export const GET_BATCH_MESSAGES = "/msgbatch/list"
export const GET_BATCH_MESSAGES_COUNTS = "/botinstance/msgcount"
export const ADD_BATCH_MESSAGE = "/msgbatch/upload"
export const UPDATE_BATCH_MESSAGE = "/msgbatch/edit"
export const DELETE_BATCH_MESSAGE = "/msgbatch/cancel"
export const CANCEL_BATCH_MESSAGE = "/msgbatch/cancel"
export const GET_BATCH_MESSAGE_REPORT = "/msgbatch/report"
export const GET_BATCH_MESSAGE_FILE = "/msgbatch/get"

// REPORTS

export const GET_INBOUND_REPORT = "/tree/report"

//TEMPLATES
export const GET_TEMPLATES = "pdftemplate/list"
export const GET_TEMPLATE_FILEDS = "pdftempalte/attributes"
export const ADD_PDF_TEMPLATE = "pdf/create"

//TOPICS
export const GET_TOPICS = "topic/list"
export const ADD_TOPIC = "/topic/add"
export const UPDATE_TOPIC = "/topic/edit"
export const DELETE_TOPIC = "/topic/deactivate"

// LOGIN
export const LOGIN = "/password/token"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"

//Mails
export const GET_INBOX_MAILS = "/inboxmails"
export const ADD_NEW_INBOX_MAIL = "/add/inboxmail"
export const DELETE_INBOX_MAIL = "/delete/inboxmail"

//starred mail
export const GET_STARRED_MAILS = "/starredmails"

//important mails
export const GET_IMPORTANT_MAILS = "/importantmails"

//Draft mail
export const GET_DRAFT_MAILS = "/draftmails"

//Send mail
export const GET_SENT_MAILS = "/sentmails"

//Trash mail
export const GET_TRASH_MAILS = "/trashmails"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"

//ORDERS
export const GET_ORDERS = "/orders"
export const ADD_NEW_ORDER = "/add/order"
export const UPDATE_ORDER = "/update/order"
export const DELETE_ORDER = "/delete/order"

//CART DATA
export const GET_CART_DATA = "/cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"
export const ADD_NEW_CUSTOMER = "/add/customer"
export const UPDATE_CUSTOMER = "/update/customer"
export const DELETE_CUSTOMER = "/delete/customer"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"

//INVOICES
export const GET_INVOICES = "/invoices"
export const GET_INVOICE_DETAIL = "/invoice"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"
export const ADD_NEW_PROJECT = "/add/project"
export const UPDATE_PROJECT = "/update/project"
export const DELETE_PROJECT = "/delete/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"
export const ADD_NEW_USER = "/add/user"
export const UPDATE_USER = "/update/user"
export const DELETE_USER = "/delete/user"

export const FILE_UPLOAD = "/websocket/upload"

//DASHBOARD
export const GET_CHOICE_COUNT = "/dashboard/choicecount"
