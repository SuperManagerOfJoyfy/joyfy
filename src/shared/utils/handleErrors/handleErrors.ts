import {
	BaseQueryApi,
	FetchBaseQueryError,
		QueryReturnValue, 
} from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"

export const handleErrors = (
	api: BaseQueryApi, 
	result: QueryReturnValue<unknown, FetchBaseQueryError>) => {

	let error = "Some error occurred"

	if (result.error) {
		switch (result.error.status) {
			case "FETCH_ERROR":
			case "PARSING_ERROR":
			case "CUSTOM_ERROR":
				error = result.error.error
				break

			case 400:
			if (result.error.data && typeof result.error.data === "object") {
					if ("message" in result.error.data) {
						error = String(result.error.data.message);
				} else if ("errorsMessages" in result.error.data) {
					const messages = result.error.data.errorsMessages;
					if (Array.isArray(messages) && messages[0]?.message) {
							error = messages[0].message;
					}
				}
			}
				break
	
			case 401:
				error = 'Unauthorized'
			break

			case 403:
				error = "403 Forbidden Error. Check API-KEY"

			case 404:
			error = "page not found (404)";

			case 500:
			error = 'Internal server error';
			break;

			default:
			error = JSON.stringify(result.error)
			break
		}
		toast.error(error)
	}
}
