import React, { useEffect, useState } from "react";
import "./MainLayout.css";
import PatchImage from "./patchImage.jpg";
import Loading from "./Loading.png";
import queryString from "query-string";

function MainLayout() {
  const [mainData, setMainData] = useState([]);
  const [launchYear, setLaunchYear] = useState(undefined);
  const [isSuccessfulLaunch, setIsSuccessfullLaunch] = useState(undefined);
  const [isSuccessfulLanding, setIsSuccessfullLanding] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const launchYears = [
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021, 2022,
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch("https://api.spaceXdata.com/v3/launches?limit=100")
      .then((response) => response.json())
      .then((data) => {
        setMainData(data);
        setIsLoading(false);
      });
  }, []);

  const mainFilter = (type, dataValue) => {
    let yearOfLaunch = launchYear;
    let successLanch = isSuccessfulLaunch;
    let successLanding = isSuccessfulLanding;
    if (type === "launchedYear") {
      if (launchYear === dataValue) {
        setLaunchYear(undefined);
        yearOfLaunch = undefined;
      } else {
        setLaunchYear(dataValue);
        yearOfLaunch = dataValue;
      }
    }
    if (type === "successfullyLaunched") {
      if (isSuccessfulLaunch === dataValue) {
        setIsSuccessfullLaunch(undefined);
        successLanch = undefined;
      } else {
        setIsSuccessfullLaunch(dataValue);
        successLanch = dataValue;
      }
    }
    if (type === "successfulLanding") {
      if (isSuccessfulLanding === dataValue) {
        setIsSuccessfullLanding(undefined);
        successLanding = undefined;
      } else {
        setIsSuccessfullLanding(dataValue);
        successLanding = dataValue;
      }
    }
    let filterData = {
      launch_success: successLanch,
      land_success: successLanding,
      launch_year: yearOfLaunch,
    };
    valuFetch(filterData);
  };

  const getUpdatedURL = (filterData) => {
    let API_BASE_URL = "https://api.spaceXdata.com/v3/launches?limit=100&";
    if (
      filterData.launch_success === undefined &&
      filterData.land_success === undefined &&
      filterData.launch_year === undefined
    ) {
      API_BASE_URL = "https://api.spaceXdata.com/v3/launches?limit=100";
    }
    return API_BASE_URL + queryString.stringify({ ...filterData });
  };

  function valuFetch(filterData) {
    const newURL = getUpdatedURL(filterData);
    setIsLoading(true);
    fetch(newURL)
      .then((response) => response.json())
      .then((data) => {
        setMainData(data);
        setIsLoading(false);
      });
  }

  return (
    <>
      <div className="OuterLayout">
        <div className="sections">
          <div className="mainTitle">SpaceX Launch Programs</div>
          <div className="mainSection">
            <div className="filterSection">
              <div className="filterTitle">Filters</div>
              <div className="launchYearTitle">
                <span style={{ borderBottom: "1px solid black" }}>
                  Launch Year
                </span>
              </div>
              <div className="launchYear">
                {launchYears.map((years, index) => (
                  <button
                    className={`launchYearButton ${
                      years == launchYear ? "activeButton" : ""
                    }`}
                    value={years}
                    key={`launchYear${index}`}
                    onClick={(e) => mainFilter("launchedYear", e.target.value)}
                  >
                    {years}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "20px" }} className="launchYearTitle">
                <span style={{ borderBottom: "1px solid black" }}>
                  Successful Launch
                </span>
              </div>
              <div style={{ marginBottom: "20px" }} className="launchYear">
                <button
                  className={`launchYearButton ${
                    isSuccessfulLaunch === true ? "activeButton" : ""
                  }`}
                  onClick={(e) => mainFilter("successfullyLaunched", true)}
                >
                  True
                </button>
                <button
                  className={`launchYearButton ${
                    isSuccessfulLaunch === false ? "activeButton" : ""
                  }`}
                  onClick={(e) => mainFilter("successfullyLaunched", false)}
                >
                  False
                </button>
              </div>
              <div className="launchYearTitle">
                <span style={{ borderBottom: "1px solid black" }}>
                  Successful Landing
                </span>
              </div>
              <div className="launchYear" style={{ marginBottom: "20px" }}>
                <button
                  className={`launchYearButton ${
                    isSuccessfulLanding === true ? "activeButton" : ""
                  }`}
                  onClick={(e) => mainFilter("successfulLanding", true)}
                >
                  True
                </button>
                <button
                  className={`launchYearButton ${
                    isSuccessfulLanding === false ? "activeButton" : ""
                  }`}
                  onClick={(e) => mainFilter("successfulLanding", false)}
                >
                  False
                </button>
              </div>
            </div>
            {isLoading === true ? (
              <>
                <div className="LoadingSection">
                  <img
                    className="loadingImage"
                    width="300px"
                    height="300px"
                    src={Loading}
                    alt="Loader"
                  />
                </div>
              </>
            ) : (
              <div className="cardSection">
                {mainData.length === 0 ? (
                  <div style={{ fontSize: "35px", fontWeight: "bold" }}>
                    No DATA Found
                  </div>
                ) : (
                  mainData?.map((data, index) => (
                    <div key={`diffCards${index}`} className="mainCards">
                      <div className="insideDivCards">
                        <div className="ImageDiv">
                          <img
                            className="ImagePatch"
                            src={PatchImage}
                            alt="Patches"
                          />
                        </div>
                        <div className="cardDetails">
                          <div className="missionName">
                            {data.mission_name}{" "}
                            <span className="innerTextCardName">
                              #{data.flight_number}
                            </span>
                          </div>
                          <div className="missionIds">
                            Mission Ids:{" "}
                            <span className="innerTextCard">
                              {data.mission_id.length === 0
                                ? "No Ids"
                                : data.mission_id}
                            </span>
                          </div>
                          <div className="launchYearData">
                            Launch Year:{" "}
                            <span className="innerTextCard">
                              {data.launch_year}
                            </span>
                          </div>
                          <div className="successfulLaunch">
                            Successful Launch:{" "}
                            <span className="innerTextCard">
                              {data.launch_success === true ? "True" : "False"}
                            </span>
                          </div>
                          <div className="successfulLanding">
                            Successful Landing:{" "}
                            <span className="innerTextCard">
                              {data.rocket.first_stage.cores[0].land_success ===
                              true
                                ? "True"
                                : "False"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="bottomContent">Developed By:- Mihir Sukhadiya</div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
