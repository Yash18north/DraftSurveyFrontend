import React, { useState } from "react";
import { getDataFromApi } from "../../../services/commonServices";
import Loading from "../../../components/common/Loading";
import { Card, CardBody } from "react-bootstrap";



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
    fieldWidth
}) => {

    const [shareArray, setShareArray] = useState([]);

    const [email, setEmail] = useState("");
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleEmailChange = async (e) => {
        setEmail(e.target.value);
        if (e.target.value?.length > 2) {
            let res = await getDataFromApi(
                `/email_suggestions/?query=${e.target.value}`
            );
            const allSuggestions = res?.data?.suggestions || [];
            const filteredSuggestions = allSuggestions.filter(
                (suggestion) => !emails.includes(suggestion)
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };
    const handleSuggestionClick = (email) => {
        setEmail(email);
        setShowSuggestions(false);
    };
    const handleEmailKeyPress = (e) => {
        if (e.key !== "Enter") return;  // Only proceed if Enter is pressed


        if (email) {
            e.preventDefault();
            setEmails([...emails, email]);
            setEmail("");
            setShareArray([...shareArray, {}]);
            onChange([...emails, email]);
        }
    };

    const removeEmail = (index) => {
        const updatedEmails = emails.filter((_, i) => i !== index);
        const updatedShareArray = shareArray.filter((_, i) => i !== index);
        setEmails(updatedEmails);
        setShareArray(updatedShareArray);
    };



    return isLoading ? (
        <Loading />
    ) : (

        <div
            style={{ position: "relative" }}
            className={
                "form-group  " + " my-2"
            }
        >

            {/* <h1>Type email address and press enter key to select email</h1> */}
            {label && (
                <label htmlFor={name} style={{ width: `${25}%` }} >
                    {label}
                    <span className="required_mark"> {required ? ` *` : null}</span>
                </label>
            )}

            <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
                <input
                    id={name || label}
                    name={name || label}
                    required={required}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    title={tooltip}
                    maxLength={characterLimit}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleEmailKeyPress}
                    className="AdvanceShareInput1"
                />

            </div>

            {showSuggestions && (
                <div className="suggestionsList suggestionsListAdv">
                    {suggestions.map((email, index) => (
                        <div
                            key={"index" + index}
                            onClick={() => {
                                handleSuggestionClick(email);
                                setEmails([...emails, email]);
                                setEmail("");
                                setShareArray([...shareArray, {}]);
                                onChange([...emails, email]);
                            }}
                        >
                            {email}
                        </div>
                    ))}
                </div>
            )}

            {/* <div className="shareItemContainer">
                {emails.map((email, index) => (
                    <div className="shareItem">
                        <span>{email}</span>
                        <div className="shareItemBtns">
                            <span className="remove-tag" onClick={() => removeEmail(index)}>
                                x
                            </span>
                        </div>
                    </div>
                ))}
            </div> */}



        </div>

    );
};

export default InputMultiEmail;
