import React, { useEffect, useState } from "react";
import { getDataFromApi } from "../../../services/commonServices";
import Loading from "../../../components/common/Loading";
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { emailSuggestionApi } from "../../../services/api";
const InputMultiEmail = ({
    name,
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
    readOnly,
    tooltip,
    characterLimit,
    actionClicked,
    fieldWidth,
    isNoEmailSuggest
}) => {

    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [emailInput, setEmailInput] = useState('');
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        if (required && emails.length == 0) {
            setErrorMsg(label + " is required");
        }
        else {
            setErrorMsg("")
        }
    }, [emails.length, required]);
    const handleEmailChange = async (e) => {
        if (e.target.value?.length > 2 && !isNoEmailSuggest) {
            let res = await getDataFromApi(
                emailSuggestionApi + `?query=${e.target.value}`
            );
            const allSuggestions = res?.data?.suggestions || [];
            const filteredSuggestions = allSuggestions.filter(
                (suggestion) => !emails.includes(suggestion)
            );
            setHighlightedIndex(-1);
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };
    const handleSuggestionClick = (email) => {
        setShowSuggestions(false);
        onChange([...emails, email]);
        setEmailInput("");
    };

    const removeEmail = (index) => {
        const updatedEmails = emails.filter((_, i) => i !== index);
        onChange(updatedEmails);
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSuggestionClick(suggestions[highlightedIndex]);
                    onChange([...emails, suggestions[highlightedIndex]]);
                }
            }
        }
    };

    // useEffect(() => {
    //     // onChange(emails);
    // }, [emails])
    useEffect(() => {
        setEmails(value);
    }, [value])
    return isLoading ? (
        <Loading />
    ) : (

        <div
            style={{ position: "relative" }}
            className={
                "form-group  " + " my-2"
            }
        >
            {label && (
                <label htmlFor={name} style={{ width: `${25}%` }} >
                    {label}
                    <span className="required_mark"> {required ? ` *` : null}</span>
                </label>
            )}
            <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
                <ReactMultiEmail
                    className="AdvanceShareInput1"
                    emails={emails || []}
                    onChange={(e) => {
                        onChange(e);
                    }}
                    inputValue={() => { return emailInput }}
                    onChangeInput={(input) => {
                        setEmailInput(input);
                        handleEmailChange({ target: { value: input } });
                    }}
                    autoFocus={true}
                    onKeyDown={handleKeyDown}
                    getLabel={(email, index, removeEmail) => {
                        return (
                            <div data-tag key={index}>
                                <div data-tag-item>{email}</div>
                                <span data-tag-handle onClick={() => removeEmail(index)}>
                                    ×
                                </span>
                            </div>
                        );
                    }}
                />
                {showSuggestions && !isNoEmailSuggest && (
                    <div className="suggestionsList suggestionsListAdv">
                        {suggestions.map((email, index) => (
                            <div
                                key={"index" + index}
                                style={{
                                    backgroundColor: highlightedIndex === index ? '#f0f0f0' : '#fff',

                                }}
                                onClick={() => { handleSuggestionClick(email); }}
                                onMouseEnter={() => setHighlightedIndex(index)}

                            >
                                {email}
                            </div>
                        ))}
                    </div>
                )}
                {errorMsg && actionClicked && (
                    <p className="text-danger errorMsg">{errorMsg}</p>
                )}
            </div>
        </div>
    );
};
export default InputMultiEmail;
