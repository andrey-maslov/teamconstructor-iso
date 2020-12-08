/*===== FETCHING DATA =====*/
import { CONTENT_API } from "../../constants/constants"
import { FETCH_CONTENT, FETCH_TERMS } from "../actionTypes"

export const fetchTerms = (lang: string) => {

    const url = `${ CONTENT_API }/psychologies/1`;

    return (dispatch: any) => {
        fetch(url)
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

    const url = `${ CONTENT_API }/psychologies/3`;

    return (dispatch: any) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_CONTENT,
                    descriptions: data[`content_${ lang }`]
                });
            });
    };
}