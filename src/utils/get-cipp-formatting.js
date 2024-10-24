import { Cancel, Check } from "@mui/icons-material";
import { Chip, Link } from "@mui/material";
import { Box } from "@mui/system";
import { CippCopyToClipBoard } from "../components/CippComponents/CippCopyToClipboard";
import { getCippLicenseTranslation } from "./get-cipp-license-translation";
import CippDataTableButton from "../components/CippTable/CippDataTableButton";
import { LinearProgressWithLabel } from "../components/linearProgressWithLabel";
import ReactTimeAgo from "react-time-ago";
export const getCippFormatting = (data, cellName, type) => {
  const isText = type === "text";
  const cellNameLower = cellName.toLowerCase();

  // if data is a data object, return a formatted date

  if (cellName === "addrow") {
    return isText ? (
      "No data"
    ) : (
      <Box component="span">
        <Chip variant="outlined" label="No data" size="small" color="info" />
      </Box>
    );
  }

  const timeAgoArray = ["ExecutedTime", "ScheduledTime", "Timestamp", "DateTime"];
  if (timeAgoArray.includes(cellName)) {
    // Convert data from Unix time to date. If conversion fails, return "No Data".
    const date = typeof data === "number" ? new Date(data * 1000) : new Date(data);
    if (isNaN(date.getTime())) {
      return isText ? (
        "No Data"
      ) : (
        <Chip variant="outlined" label="No Data" size="small" color="info" />
      );
    }
    return isText ? <ReactTimeAgo date={date} /> : <ReactTimeAgo date={date} />;
  }

  if (cellName === "RepeatsEvery") {
    //convert 1d to "Every 1 day", 1w to "Every 1 week" etc.
    const match = data.match(/(\d+)([a-zA-Z]+)/);
    if (match) {
      const value = match[1];
      const unit = match[2];
      const unitText =
        unit === "d"
          ? "day"
          : unit === "h"
          ? "hour"
          : unit === "w"
          ? "week"
          : unit === "m"
          ? "minutes"
          : unit === "y"
          ? "year"
          : unit;
      return isText ? `Every ${value} ${unitText}` : `Every ${value} ${unitText}`;
    }
  }
  if (cellName === "ReportInterval") {
    //domainAnalyser layouts
    //device by 86400 to get days, then return "days"
    const days = data / 86400;
    return isText ? `${days} days` : `${days} days`;
  }
  if (cellName === "DMARCPolicy") {
    if (data === "s") {
      data = "Strict";
    }
    if (data === "r") {
      data = "Relaxed";
    }
    if (data === "afrf") {
      data = "Authentication Failure";
    }
    return isText ? data : <Chip variant="outlined" label={data} size="small" color="info" />;
  }

  if (cellName === "ScorePercentage") {
    return isText ? `${data}%` : <LinearProgressWithLabel variant="determinate" value={data} />;
  }

  if (cellName === "DMARCPercentagePass") {
    return isText ? `${data}%` : <LinearProgressWithLabel variant="determinate" value={data} />;
  }

  if (cellName === "ScoreExplanation") {
    return isText ? data : <Chip variant="outlined" label={data} size="small" color="info" />;
  }

  if (cellName === "DMARCActionPolicy") {
    if (data === "") {
      data = "No DMARC Action";
    }
    return isText ? data : <Chip variant="outlined" label={data} size="small" color="info" />;
  }

  if (cellName === "MailProvider") {
    if (data === "Null") {
      data = "Unknown";
    }
    return isText ? data : <Chip variant="outlined" label={data} size="small" color="info" />;
  }

  //if the cellName is tenantFilter, return a chip with the tenant name. This can sometimes be an array, sometimes be a single item.
  if (cellName === "tenantFilter" || cellName === "Tenant") {
    //check if data is an array.
    if (Array.isArray(data)) {
      return isText
        ? data.join(", ")
        : data.map((item) => (
            <CippCopyToClipBoard key={item.value} text={item.label} type="chip" />
          ));
    } else {
      return isText ? data : <Chip variant="outlined" label={data} size="small" color="info" />;
    }
  }

  if (cellName === "excludedTenants") {
    //check if data is an array.
    if (Array.isArray(data)) {
      return isText
        ? data.join(", ")
        : data.map((item) => (
            <CippCopyToClipBoard key={item.value} text={item.label} type="chip" />
          ));
    }
  }
  if (cellName === "bulkUser") {
    return isText ? `${data.length} new users to create` : `${data.length} new users to create`;
  }

  if (data?.enabled === true && data?.date) {
    return isText
      ? `Yes, Scheduled for ${new Date(data.date).toLocaleString()}`
      : `Yes, Scheduled for ${new Date(data.date).toLocaleString()}`;
  }
  if (data?.enabled === true || data?.enabled === false) {
    return isText ? (
      data.enabled ? (
        "Yes"
      ) : (
        "No"
      )
    ) : data.enabled ? (
      <Check fontSize="10" />
    ) : (
      <Cancel fontSize="10" />
    );
  }

  // Handle null or undefined data
  if (data === null || data === undefined) {
    return isText ? (
      "No data"
    ) : (
      <Box component="span">
        <Chip variant="outlined" label="No data" size="small" color="info" />
      </Box>
    );
  }

  // Handle proxyAddresses
  if (cellName === "proxyAddresses") {
    const emails = data.map((email) => email.replace(/smtp:/i, ""));
    return isText
      ? emails.join(", ")
      : emails.map((email) => <CippCopyToClipBoard key={email} text={email} type="chip" />);
  }

  // Handle assigned licenses
  if (cellName === "assignedLicenses") {
    return isText ? getCippLicenseTranslation(data) : getCippLicenseTranslation(data);
  }

  // Handle boolean data
  if (typeof data === "boolean" || cellNameLower === "bool") {
    return isText ? (
      data ? (
        "Yes"
      ) : (
        "No"
      )
    ) : (
      <Box component="span">{data ? <Check fontSize="10" /> : <Cancel fontSize="10" />}</Box>
    );
  }

  // Handle null or undefined data
  if (data === null || data === undefined) {
    return isText ? (
      "No data"
    ) : (
      <Box component="span">
        <Chip variant="outlined" label="No data" size="small" color="info" />
      </Box>
    );
  }

  //if string starts with http, return a link
  if (typeof data === "string" && data.toLowerCase().startsWith("http")) {
    return isText ? (
      data
    ) : (
      <Link href={data} target="_blank" rel="noreferrer">
        URL
      </Link>
    );
  }

  // Handle arrays of strings
  if (Array.isArray(data) && data.every((item) => typeof item === "string")) {
    //if the array is empty, return "No data"
    return isText
      ? data.join(", ")
      : data.map((item) => <CippCopyToClipBoard key={item} text={item} type="chip" />);
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    return isText ? JSON.stringify(data) : <CippDataTableButton data={data} />;
  }

  // Default case: return data as-is
  return isText ? String(data) : <span>{data}</span>;
};
