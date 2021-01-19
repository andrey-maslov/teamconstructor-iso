import { termsApiUrl } from './utils'
import { FETCH_CONTENT, FETCH_TERMS } from "../actionTypes"
import { anyType } from "../../constants/types";

export const fetchTerms = (lang: string) => {

    return (dispatch: anyType) => {
        fetch(`${termsApiUrl}/1`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_TERMS,
                    terms: data[`content_${ lang }`]
                });
            });
    };
}

export const fetchContent = (lang: string) => {

    return (dispatch: anyType) => {
        fetch(`${termsApiUrl}/3`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_CONTENT,
                    descriptions: data[`content_${ lang }`]
                });
            });
    };
}