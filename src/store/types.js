// Error and loading
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'
export const BEGIN_LOADING = 'BEGIN_LOADING'
export const END_LOADING = 'END_LOADING'

// Token
export const SET_TOKEN = 'SET_TOKEN'
export const DEL_TOKEN = 'DEL_TOKEN'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'
export const RETRIEVE_TOKEN = 'RETRIEVE_TOKEN'
export const TOKEN_ERROR_MESSAGES = [
  'Token invalide',
  'token manquant',
  'token expire',
  'Token expiré'
]

// User
export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const GET_USERS = 'GET_USERS'
export const UPDATE_USER = 'UPDATE_USER'
export const DEL_USER = 'DEL_USER'
export const CREATE_USER = 'CREATE_USER'
export const CHANGE_PWD = 'CHANGE_PWD'

// Housings
export const GET_HOUSINGS = 'GET_HOUSINGS'
export const GET_PAGINATED_HOUSINGS = 'GET_PAGINATED_HOUSINGS'
export const CREATE_HOUSING = 'CREATE_HOUSING'
export const UPDATE_HOUSING = 'UPDATE_HOUSING'
export const DEL_HOUSING = 'DEL_HOUSING'
export const UPLOAD_HOUSINGS = 'UPLOAD_HOUSINGS'
export const UPLOAD_HOUSING_COMMITMENT_LINK = 'UPLOAD_HOUSING_COMMITMENT_LINK'
export const GET_HOUSING_FORECASTS = 'GET_HOUSING_FORECASTS'
export const CREATE_HOUSING_FORECAST = 'CREATE_HOUSING_FORECAST'
export const UPDATE_HOUSING_FORECAST = 'UPDATE_HOUSING_FORECAST'
export const DELETE_HOUSING_FORECAST = 'DELETE_HOUSING_FORECAST'
export const GET_HOUSINGS_DATAS = 'GET_HOUSINGS_DATAS'
export const GET_HOUSING_DATAS = 'GET_HOUSING_DATAS'
export const GET_HOUSING_COMMITMENTS = 'GET_HOUSING_COMMITMENTS'
export const GET_HOUSING_PAYMENTS = 'GET_HOUSING_PAYMENTS'
export const UPLOAD_HOUSING_SUMMARY = 'UPLOAD_HOUSING_SUMMARY'

// Copros
export const GET_COPROS = 'GET_COPROS'
export const CREATE_COPRO = 'CREATE_COPRO'
export const UPDATE_COPRO = 'UPDATE_COPRO'
export const DEL_COPRO = 'DEL_COPRO'
export const UPLOAD_COPROS = 'UPLOAD_COPROS'
export const UPLOAD_COPRO_COMMITMENT_LINK = 'UPLOAD_COPRO_COMMITMENT_LINK'
export const GET_COPRO_DATAS = 'GET_COPRO_DATAS'
export const GET_COPRO_COMMITMENTS = 'GET_COPRO_COMMITMENTS'
export const GET_COPRO_PAYMENTS = 'GET_COPRO_PAYMENTS'
export const GET_COPRO_FORECASTS = 'GET_COPRO_FORECASTS'
export const CREATE_COPRO_FORECAST = 'CREATE_COPRO_FORECAST'
export const UPDATE_COPRO_FORECAST = 'UPDATE_COPRO_FORECAST'
export const DELETE_COPRO_FORECAST = 'DELETE_COPRO_FORECAST'
export const GET_COPRO_REPORT = 'GET_COPRO_REPORT'

// RenewProjects
export const GET_RENEW_PROJECTS = 'GET_RENEW_PROJECTS'
export const CREATE_RENEW_PROJECT = 'CREATE_RENEW_PROJECT'
export const UPDATE_RENEW_PROJECT = 'UPDATE_RENEW_PROJECT'
export const DEL_RENEW_PROJECT = 'DEL_RENEW_PROJECT'
export const UPLOAD_RENEW_PROJECTS = 'UPLOAD_RENEW_PROJECTS'
export const GET_RENEW_PROJECT_DATAS = 'GET_RENEW_PROJECT_DATAS'
export const GET_RENEW_PROJECT_COMMITMENTS = 'GET_RENEW_PROJECT_COMMITMENTS'
export const GET_RENEW_PROJECT_PAYMENTS = 'GET_RENEW_PROJECT_PAYMENTS'
export const GET_RENEW_PROJECT_FORECASTS = 'GET_RENEW_PROJECT_FORECASTS'
export const CREATE_RENEW_PROJECT_FORECAST = 'CREATE_RENEW_PROJECT_FORECAST'
export const UPDATE_RENEW_PROJECT_FORECAST = 'UPDATE_RENEW_PROJECT_FORECAST'
export const DELETE_RENEW_PROJECT_FORECAST = 'DELETE_RENEW_PROJECT_FORECAST'
export const CREATE_RENEW_PROJECT_EVENT = 'CREATE_RENEW_PROJECT_EVENT'
export const UPDATE_RENEW_PROJECT_EVENT = 'UPDATE_RENEW_PROJECT_EVENT'
export const DELETE_RENEW_PROJECT_EVENT = 'DELETE_RENEW_PROJECT_EVENT'
export const DOWNLOAD_RP_REPORT = 'DOWNLOAD_RP_REPORT'
export const GET_RENEW_PROJECT_REPORT = 'GET_RENEW_PROJECT_REPORT'

// Settings
export const GET_SETTINGS = 'GET_SETTINGS'

// BudgetSectors
export const GET_SECTORS = 'GET_SECTORS'
export const CREATE_SECTOR = 'CREATE_SECTOR'
export const UPDATE_SECTOR = 'UPDATE_SECTOR'
export const DEL_SECTOR = 'DEL_SECTOR'

// BudgetActions
export const GET_ACTIONS = 'GET_ACTIONS'
export const CREATE_ACTION = 'CREATE_ACTION'
export const UPDATE_ACTION = 'UPDATE_ACTION'
export const DEL_ACTION = 'DEL_ACTION'

// Commissions
export const GET_COMMISSIONS = 'GET_COMMISSIONS'
export const CREATE_COMMISSION = 'CREATE_COMMISSION'
export const UPDATE_COMMISSION = 'UPDATE_COMMISSION'
export const DEL_COMMISSION = 'DEL_COMMISSION'

// Cities
export const GET_CITIES = 'GET_CITIES'
export const GET_PAGINATED_CITIES = 'GET_PAGINATED_CITIES'
export const CREATE_CITY = 'CREATE_CITY'
export const UPDATE_CITY = 'UPDATE_CITY'
export const DEL_CITY = 'DEL_CITY'
export const UPLOAD_CITIES = 'UPLOAD_CITIES'

// Community
export const GET_COMMUNITIES = 'GET_COMMUNITIES'
export const CREATE_COMMUNITY = 'CREATE_COMMUNITY'
export const UPDATE_COMMUNITY = 'UPDATE_COMMUNITY'
export const DEL_COMMUNITY = 'DEL_COMMUNITY'
export const UPLOAD_COMMUNITIES = 'UPLOAD_COMMUNITIES'

// Commitments
export const GET_COMMITMENTS = 'GET_COMMITMENTS'
export const UPLOAD_COMMITMENTS = 'UPLOAD_COMMITMENTS'
export const EXPORT_COMMITMENTS = 'EXPORT_COMMITMENTS'
export const UNLINK_COMMITMENTS = 'UNLINK_COMMITMENTS'
export const GET_UNLINKED_COMMITMENTS = 'GET_UNLINKED_COMMITMENTS'
export const LINK_COMMITMENTS = 'LINK_COMMITMENTS'
export const EXPORT_ELDEST_COMMITMENTS = 'EXPORT_ELDEST_COMMITMENTS'
export const EXPORT_UNPAID_COMMITMENTS = 'EXPORT_UNPAID_COMMITMENTS'

// Payments
export const GET_PAYMENTS = 'GET_PAYMENTS'
export const UPLOAD_PAYMENTS = 'UPLOAD_PAYMENTS'
export const EXPORT_PAYMENTS = 'EXPORT_PAYMENTS'

// Beneficiaries
export const GET_BENEFICIARIES = 'GET_BENEFICIARIES'
export const GET_ALL_BENEFICIARIES = 'GET_ALL_BENEFICIARIES'
export const GET_BENEFICIARY_DATAS = 'GET_BENEFICIARY_DATAS'
export const EXPORT_BENEFICIARY_DATAS = 'EXPORT_BENEFICIARY_DATAS'
export const GET_BENEFICIARY_PAYMENTS = 'GET_BENEFICIARY_PAYMENTS'
export const CREATE_BENEFICIARY = 'CREATE_BENEFICIARY'
export const UPDATE_BENEFICIARY = 'UPDATE_BENEFICIARY'
export const DELETE_BENEFICIARY = 'DELETE_BENEFICIARY'

// Home
export const GET_HOME_DATAS = 'GET_HOME_DATAS'
export const SET_HOME_MESSAGE = 'SET_HOME_MESSAGE'

// Ratios
export const GET_YEAR_RATIOS = 'GET_YEAR_RATIOS'
export const SAVE_YEAR_RATIOS = 'SAVE_YEAR_RATIOS'
export const GET_RATIOS_YEARS = 'GET_RATIOS_YEARS'

// Payment Forecasts
export const GET_PMT_FORECASTS = 'GET_PMT_FORECASTS'

// Commitment forecasts
export const GET_CMT_FORECASTS = 'GET_CMT_FORECASTS'

// RP Event Types
export const GET_RP_EVENT_TYPE = 'GET_RP_EVENT_TYPE'
export const GET_RP_EVENT_TYPES = 'GET_RP_EVENT_TYPES'
export const UPDATE_RP_EVENT_TYPE = 'UPDATE_RP_EVENT_TYPE'
export const CREATE_RP_EVENT_TYPE = 'CREATE_RP_EVENT_TYPE'
export const DELETE_RP_EVENT_TYPE = 'DELETE_RP_EVENT_TYPE'

// RP commitment / city joint
export const CREATE_CMT_CITY_JOIN = 'CREATE_CMT_CITY_JOIN'
export const UPDATE_CMT_CITY_JOIN = 'UPDATE_CMT_CITY_JOIN'
export const DEL_CMT_CITY_JOIN = 'DEL_CMT_CITY_JOIN'

// Summaries
export const GET_DPT_REPORT = 'GET_DPT_REPORT'
export const GET_CITY_REPORT = 'GET_CITY_REPORT'
export const GET_SUMMARIES_DATAS = 'GET_SUMMARIES_DATAS'

// PreProg
export const GET_PRE_PROG = 'GET_PRE_PROG'
export const GET_KIND_PRE_PROG = 'GET_KIND_PRE_PROG'
export const GET_ALL_PRE_PROG = 'GET_ALL_PRE_PROG'
export const SET_PRE_PROG = 'SET_PRE_PROG'

// Prog
export const GET_PROG = 'GET_PROG'
export const GET_PROG_AND_DATAS = 'GET_PROG_AND_DATAS'
export const SET_PROG = 'SET_PROG'

// Kind
export const explicitKind = ['LLS', 'Copro', 'RU']

// RPLS
export const GET_RPLS = 'GET_RPLS'
export const GET_RPLS_DATAS = 'GET_RPLS_DATAS'
export const DEL_RPLS = 'DEL_RPLS'
export const UPLOAD_RPLS = 'UPLOAD_RPLS'
export const CREATE_RPLS = 'CREATE_RPLS'
export const UPDATE_RPLS = 'UPDATE_RPLS'
export const GET_RPLS_YEARS = 'GET_RPLS_YEARS'
export const GET_RPLS_REPORT = 'GET_RPLS_REPORT'
export const DOWNLOAD_DETAILED_RPLS_REPORT = 'DOWNLOAD_DETAILED_RPLS_REPORT'

// Copro Event Types
export const DELETE_COPRO_EVENT_TYPE = 'DELETE_COPRO_EVENT_TYPE'
export const CREATE_COPRO_EVENT_TYPE = 'CREATE_COPRO_EVENT_TYPE'
export const UPDATE_COPRO_EVENT_TYPE = 'UPDATE_COPRO_EVENT_TYPE'
export const GET_COPRO_EVENT_TYPE = 'GET_COPRO_EVENT_TYPE'
export const GET_COPRO_EVENT_TYPES = 'GET_COPRO_EVENT_TYPES'

// Copro events
export const GET_COPRO_EVENTS = 'GET_COPRO_EVENTS'
export const UPDATE_COPRO_EVENT = 'UPDATE_COPRO_EVENT'
export const DELETE_COPRO_EVENT = 'DELETE_COPRO_EVENT'
export const CREATE_COPRO_EVENT = 'CREATE_COPRO_EVENT'

// Copro docs
export const GET_COPRO_DOCS = 'GET_COPRO_DOCS'
export const UPDATE_COPRO_DOC = 'UPDATE_COPRO_DOC'
export const DELETE_COPRO_DOC = 'DELETE_COPRO_DOC'
export const CREATE_COPRO_DOC = 'CREATE_COPRO_DOC'

// Payment credit
export const GET_ALL_PAYMENT_CREDITS = 'GET_ALL_PAYMENT_CREDITS'
export const GET_PAYMENT_CREDIT_JOURNAL = 'GET_PAYMENT_CREDIT_JOURNAL'
export const GET_PAYMENT_CREDITS = 'GET_PAYMENT_CREDITS'
export const UPLOAD_PAYMENT_CREDITS = 'UPLOAD_PAYMENT_CREDITS'
export const UPLOAD_PAYMENT_CREDIT_JOURNAL = 'UPLOAD_PAYMENT_CREDIT_JOURNAL'

// Placements
export const GET_PLACEMENTS = 'GET_PLACEMENTS'
export const UPDATE_PLACEMENT = 'UPDATE_PLACEMENT'
export const UPLOAD_PLACEMENTS = 'UPLOAD_PLACEMENTS'

// BeneficiaryGroups
export const GET_BENEFICIARY_GROUPS = 'GET_BENEFICIARY_GROUPS'
export const GET_BENEFICIARY_GROUP_ITEMS = 'GET_BENEFICIARY_GROUP_ITEMS'
export const SET_BENEFICIARY_GROUP_ITEMS = 'SET_BENEFICIARY_GROUP_ITEMS'
export const CREATE_BENEFICIARY_GROUP = 'CREATE_BENEFICIARY_GROUP'
export const UPDATE_BENEFICIARY_GROUP = 'UPDATE_BENEFICIARY_GROUP'
export const DELETE_BENEFICIARY_GROUP = 'DELETE_BENEFICIARY_GROUP'
export const GET_BENEFICIARY_GROUP_DATAS = 'GET_BENEFICIARY_GROUP_DATAS'
export const EXPORT_BENEFICIARY_GROUP_DATAS = 'EXPORT_BENEFICIARY_GROUP_DATAS'
export const GET_BENEFICIARY_GROUP_PLACEMENTS = 'GET_BENEFICIARY_GROUP_PLACEMENTS'

// ReservationFees
export const UPLOAD_RESERVATION_FEES = 'UPLOAD_RESERVATION_FEES'
export const TEST_UPLOAD_RESERVATION_FEES = 'TEST_UPLOAD_RESERVATION_FEES'
export const GET_RESERVATION_FEES = 'GET_RESERVATION_FEES'
export const GET_INITIAL_RESERVATION_FEES = 'GET_INITIAL_RESERVATION_FEES'
export const GET_RESERVATION_FEES_SETTINGS = 'GET_RESERVATION_FEES_SETTINGS'
export const EXPORT_RESERVATION_FEES = 'EXPORT_RESERVATION_FEES'
export const CREATE_RESERVATION_FEE = 'CREATE_RESERVATION_FEE'
export const UPDATE_RESERVATION_FEE = 'UPDATE_RESERVATION_FEE'
export const DELETE_RESERVATION_FEE = 'DELETE_RESERVATION_FEE'
export const GET_HOUSING_TYPOLOGIES = 'GET_HOUSING_TYPOLOGIES'
export const GET_HOUSING_COMMENTS = 'GET_HOUSING_COMMENTS'
export const GET_CONVENTION_TYPES = 'GET_CONVENTION_TYPES'
export const GET_HOUSING_TRANSFERS = 'GET_HOUSING_TRANSFERS'
export const CREATE_HOUSING_TYPOLOGY = 'CREATE_HOUSING_TYPOLOGY'
export const UPDATE_HOUSING_TYPOLOGY = 'UPDATE_HOUSING_TYPOLOGY'
export const DELETE_HOUSING_TYPOLOGY = 'DELETE_HOUSING_TYPOLOGY'
export const CREATE_CONVENTION_TYPE = 'CREATE_CONVENTION_TYPE'
export const UPDATE_CONVENTION_TYPE = 'UPDATE_CONVENTION_TYPE'
export const DELETE_CONVENTION_TYPE = 'DELETE_CONVENTION_TYPE'
export const CREATE_HOUSING_TRANSFER = 'CREATE_HOUSING_TRANSFER'
export const UPDATE_HOUSING_TRANSFER = 'UPDATE_HOUSING_TRANSFER'
export const DELETE_HOUSING_TRANSFER = 'DELETE_HOUSING_TRANSFER'
export const CREATE_HOUSING_COMMENT = 'CREATE_HOUSING_COMMENT'
export const UPDATE_HOUSING_COMMENT = 'UPDATE_HOUSING_COMMENT'
export const DELETE_HOUSING_COMMENT = 'DELETE_HOUSING_COMMENT'
export const GET_RESERVATION_REPORTS = 'GET_RESERVATION_REPORTS'
export const CREATE_RESERVATION_REPORT = 'CREATE_RESERVATION_REPORT'
export const UPDATE_RESERVATION_REPORT = 'UPDATE_RESERVATION_REPORT'
export const DELETE_RESERVATION_REPORT = 'DELETE_RESERVATION_REPORT'

// Housing types
export const GET_HOUSING_TYPES = 'GET_HOUSING_TYPES'
export const CREATE_HOUSING_TYPE = 'CREATE_HOUSING_TYPE'
export const UPDATE_HOUSING_TYPE = 'UPDATE_HOUSING_TYPE'
export const DELETE_HOUSING_TYPE = 'DELETE_HOUSING_TYPE'
export const UPLOAD_IRIS_HOUSING_TYPES = 'UPLOAD_IRIS_HOUSING_TYPES'

// difPaymentPrevisions
export const GET_DIF_PAYMENT_PREVISIONS = 'GET_DIF_PAYMENT_PREVISIONS'

// Payment demands
export const UPLOAD_PAYMENT_DEMANDS = 'UPLOAD_PAYMENT_DEMANDS'
export const UPDATE_PAYMENT_DEMAND = 'UPDATE_PAYMENT_DEMAND'
export const GET_PAYMENT_DEMANDS = 'GET_PAYMENT_DEMANDS'
export const GET_PAYMENT_DEMAND_COUNTS = 'GET_PAYMENT_DEMAND_COUNTS'

// Payment delays
export const GET_PAYMENT_DELAYS = 'GET_PAYMENT_DELAYS'
export const GET_PAYMENTS_DEMANDS_STOCKS = 'GET_PAYMENTS_DEMANDS_STOCKS'
