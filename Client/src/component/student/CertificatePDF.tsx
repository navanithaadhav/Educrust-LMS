import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

interface Props {
    studentName: string;
    courseName: string;
    date: string;
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#0a192f",
        padding: 40,
        fontFamily: "Helvetica",
        color: "white"
    },

    title: {
        fontSize: 48,
        textAlign: "center",
        marginTop: 80,
        letterSpacing: 3
    },

    sub: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 10,
        color: "#9ca3af",
        letterSpacing: 3
    },

    name: {
        fontSize: 34,
        textAlign: "center",
        marginTop: 40,
        fontWeight: "bold",
        color: "#facc15"
    },

    course: {
        fontSize: 22,
        textAlign: "center",
        marginTop: 20
    },

    date: {
        textAlign: "center",
        marginTop: 30,
        fontSize: 14,
        color: "#9ca3af"
    },

    footer: {
        position: "absolute",
        bottom: 40,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    sign: {
        fontSize: 12,
        textAlign: "center"
    }
});

const CertificatePDF: React.FC<Props> = ({ studentName, courseName, date }) => (
    <Document>
        <Page size={[1000, 700]} style={styles.page}>

            <Text style={styles.title}>CERTIFICATE</Text>
            <Text style={styles.sub}>OF ACHIEVEMENT</Text>

            <Text style={{ textAlign: "center", marginTop: 30 }}>
                This is to acknowledge that
            </Text>

            <Text style={styles.name}>{studentName}</Text>

            <Text style={{ textAlign: "center", marginTop: 20 }}>
                has successfully completed
            </Text>

            <Text style={styles.course}>{courseName}</Text>

            <Text style={styles.date}>Date: {date}</Text>

            <View style={styles.footer}>
                <Text style={styles.sign}>Instructor</Text>
                <Text style={styles.sign}>CEO</Text>
            </View>

        </Page>
    </Document>
);

export default CertificatePDF;