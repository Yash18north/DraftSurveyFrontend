import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import BGImage from "../../assets/images/TestMemo/bg.jpg";
import Logo from "../../assets/images/TestMemo/TCRC LOGO.jpg";
import FooterImg from "../../assets/images/TestMemo/footer.png";
import TestReportPreviewDetails from "./testReportFiles/TestReportPreviewDetails";
import PropTypes from "prop-types";
import { getFormatedDate } from '../../services/commonFunction';
const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      position: 'relative'
    },
    headerFooterContentBg: {
      backgroundImage: `url(${BGImage})`,
      backgroundSize: 'cover',
      padding: '10px 80px',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      padding: '8px',
      textAlign: 'center',
    },
    tableCell: {
      padding: '8px',
      textAlign: 'center',
    },
    logoDescription: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      top: 0,
    },
    logoDescriptionH1: {
      color: '#E11D07',
      width: '100%',
      fontSize: '12px',
      fontWeight: 700,
    },
    logoDescriptionSpan: {
      fontSize: '12px',
    },
    logoDescriptionP: {
      fontSize: '13px',
      width: '50%',
      fontWeight: '500 !important',
    },
    tcrcHeaderLogo: {
      width: '30vw',
      height: '100px',
    },
    headingH1: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 700,
      textTransform: 'uppercase',
      marginLeft: '70px',
      paddingLeft: '80px',
    },
    headingWithLogos: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '40px',
    },
    nablImg: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    // nablImgImg: {
    //   width: '150px',
    //   height: '150px',
    // },
    ulrDetails: {
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    ulrDetailsH3: {
      fontWeight: '600 !important',
      fontSize: 'large !important',
    },
    jobDetails: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    jobDetailsP: {
      width: '46%',
      marginBottom: '10px',
    },
    jobDetailsSpan: {
      width: '8%',
      display: 'flex',
      alignItems: 'center',
    },
    footerDetails: {
      marginBottom: '20px',
    },
    footerDetailsImg: {
      width: '100%',
      height: '250px',
      marginTop: '45px',
    },
    roles: {
      paddingTop: '$select-height',
      display: 'flex',
      justifyContent: 'space-between',
    },
    rolesDiv: {
      display: 'flex',
      flexDirection: 'column',
    },
    end: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    firstTd: {
      border: '2px solid #8080809c',
      textAlign: 'center',
      fontSize: '17px',
      fontWeight: 600,
    },
    secondTd: {
      border: '2px solid #8080809c',
      fontSize: '15px',
      fontWeight: 500,
    },
    thirdTd: {
      border: '2px solid #8080809c',
      fontSize: '13px',
      fontWeight: 400,
    },
    headerUrsLabel: {
      margin: '24px 10px 16px',
    },
    width33: {
      width: '33%',
      marginTop: '3% !important',
    },
    paramterTableSpecialClass: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      alignItems: 'baseline',
    },
    paramterTableSpecialClassDiv: {
      height: '38px',
    },
    resultLabel: {
      fontSize: '17px',
      fontWeight: 600,
    },
    paramTableDataTd: {
      padding: '5px',
    },
});


const PDFReportDocument = ({ responsedata, labDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.bgImage} src={BGImage} />
      <View style={styles.header}>
        <Image style={styles.logo} src={Logo} />
        <Text style={styles.headerText} className='header-footer-content-bg'>
          {labDetails?.company?.cmp_name}
          {"\n"}
          (Formerly Known As Therapeutics Chemical Research Corporation)
          {"\n"}
          {labDetails?.company?.cmp_address}
          {"\n"}
          Tel: {labDetails?.company?.cmp_phoneno}
          {"\n"}
          Email: {labDetails?.company?.cmp_email}
        </Text>
        <Image style={styles.logo} src={Logo} />
      </View>
      <View style={styles.body}>
        <TestReportPreviewDetails
          scopType="scope"
          testMemoId={responsedata.testMemoId}
          responsedata={responsedata}
        />
        <TestReportPreviewDetails
          scopType="non_scope"
          testMemoId={responsedata.testMemoId}
          responsedata={responsedata}
        />
      </View>
      <View style={styles.footer}>
        <Image src={FooterImg} />
        <Text>
          Doc. No. {labDetails.lab_ic_msfm_no} Issue Date & No. {getFormatedDate(labDetails?.lab_ic_msfm_no_issue_date , 1)}/{labDetails?.lab_ic_msfm_no_issueno || "--"}

        </Text>
      </View>
    </Page>
  </Document>
);
PDFReportDocument.propTypes = {
  responsedata: PropTypes.object,
  labDetails: PropTypes.object,
};

export default PDFReportDocument;
