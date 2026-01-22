import React, { useEffect, useRef, useState } from 'react'
import { Tab, Table, Tabs, Card, Row, CardTitle, CardText, Col } from 'react-bootstrap';


const OccassionsTabs = ({ birthdays, wkanniversary, getBirthdayWorkAnniversary }) => {
    const scrollRef = useRef()
    const [activeTab, setActiveTab] = useState("birthday");
    const [page, setPage] = useState(1);

    useEffect(() => {
        getBirthdayWorkAnniversary(activeTab);
    }, [activeTab]);



    const getJoiningYears = (dateJoined) => {

        const joiningDate = new Date(dateJoined);
        const currentDate = new Date();

        let years = currentDate.getFullYear() - joiningDate.getFullYear();
        const hasNotCompletedYear =
            currentDate.getMonth() < joiningDate.getMonth() ||
            (currentDate.getMonth() === joiningDate.getMonth() &&
                currentDate.getDate() < joiningDate.getDate());

        if (hasNotCompletedYear) {
            years -= 1;
        }
        return years === 1 ? `${years} yr` : `${years} yrs`;


    };


    const handleApiCall = (tabKey) => {
        setActiveTab(tabKey);
    };


    const showList =
        activeTab === "birthday"
            ? (birthdays?.data?.data || [])
            : (wkanniversary?.data?.data || []);


    return (
        <div className="dash-wrapper" ref={scrollRef} id="occasions-container">
            <div className="tabs-row" id="occasions-tabs">
                <button
                    className={`tab-btn${activeTab === "birthday" ? " active" : ""}`}
                    id="tab-btn-birthday"
                    onClick={() => { setActiveTab("birthday"); setPage(1); }}
                >
                    🎂 Birthdays
                </button>
                <button
                    className={`tab-btn${activeTab === "wkanniversary" ? " active" : ""}`}
                    id="tab-btn-wkanniversary"
                    onClick={() => { setActiveTab("wkanniversary"); setPage(1); }}
                >
                    🏆 Work Anniversaries
                </button>
            </div>

            <div className="card-list">
                {showList.length === 0 && (
                    <div style={{ textAlign: "center", color: "#ec2405ff", fontWeight: 500, padding: "18px 4px" }}>
                        No entries to show.
                    </div>
                )}
                {showList.map((person, idx) => (
                    <div
                        className="occasion-card"
                        id={`occasion-card-${idx}`}
                        key={idx}
                    >

                        <span className="card-icon">
                            {activeTab === "birthday" ? "🎂" : "🏆"}
                        </span>

                        <span className="card-name">
                            {person.first_name} {person.last_name}
                            <i className="bdaybranchcode"> {"- " + (`${person?.branch?.br_name || person?.lab?.lab_name}`)}</i>
                            {/* <i className="bdaybranchcode"> {person?.branch?.br_code ?  (` - ${person?.branch?.br_code}`) : ''}</i> */}
                        </span>

                        {activeTab === "birthday" ? (
                            <span className="card-date">

                            </span>
                        ) : (
                            <span className="card-date">
                                {getJoiningYears(person.date_joined)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OccassionsTabs
