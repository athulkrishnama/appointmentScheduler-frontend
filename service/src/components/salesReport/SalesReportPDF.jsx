import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  header: { textAlign: "center", fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  summaryContainer: { 
    marginBottom: 20, 
    padding: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    backgroundColor: "#f0f0f0" 
  },
  summaryItem: { fontSize: 12, marginBottom: 5 },
  summaryLabel: { fontWeight: "bold" },
  table: { width: "100%", borderWidth: 1, marginBottom: 10 },
  row: { flexDirection: "row", borderBottomWidth: 1, padding: 5 },
  column: { flex: 1, textAlign: "center", fontSize: 10, wordWrap: "break-word" },
  idColumn: { flex: 1.5, textAlign: "center", fontSize: 8, wordWrap: "break-word" },
});

const MyDocument = ( report) => {
    const data = report.salesReport
  const serviceProviderName = "Hardcoded Service Provider"; // Replaceable later

  const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDiscount = data.reduce((acc, curr) => acc + curr.couponDiscount, 0);
  const totalAppointments = data.length;
  const pendingAppointments = data.filter((d) => d.status === "pending").length;
  const cancelledAppointments = data.filter((d) => d.status === "cancelled").length;
  const completedAppointments = data.filter((d) => d.status === "completed").length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{serviceProviderName} - Sales Report</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Amount:</Text> Rs.{totalAmount}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Discount:</Text> Rs.{totalDiscount}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Appointments:</Text> {totalAppointments}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Pending:</Text> {pendingAppointments}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Cancelled:</Text> {cancelledAppointments}</Text>
          <Text style={styles.summaryItem}><Text style={styles.summaryLabel}>Completed:</Text> {completedAppointments}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.row}>
            {["ID", "Client Name", "Service", "Amount", "Discount", "Final Amount", "Date", "Status"].map((header, index) => (
              <Text key={index} style={index === 0 ? styles.idColumn : styles.column}>
                {header}
              </Text>
            ))}
          </View>
          {data.map((item) => (
            <View key={item._id} style={styles.row}>
              <Text style={styles.idColumn}>{item._id}</Text>
              <Text style={styles.column}>{item.client.fullname}</Text>
              <Text style={styles.column}>{item.service.serviceName}</Text>
              <Text style={styles.column}>Rs.{item.amount}</Text>
              <Text style={styles.column}>Rs.{item.couponDiscount}</Text>
              <Text style={styles.column}>Rs.{item.amount - item.couponDiscount}</Text>
              <Text style={styles.column}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.column}>{item.status}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
