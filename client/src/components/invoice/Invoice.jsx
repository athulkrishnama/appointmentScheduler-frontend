import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  companyInfo: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  descriptionCell: {
    width: '60%',
  },
  amountCell: {
    width: '40%',
    textAlign: 'right',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  additionalInfo: {
    marginTop: 20,
    fontSize: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
});

const MyDocument = ({ appointment, serviceRequest }) => {
  // Calculate total amount
  const totalAmount = serviceRequest.quotation.amountBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.infoText}>Date: {formatDate(appointment.date)}</Text>
          <Text style={styles.infoText}>Invoice #: {appointment._id}</Text>
        </View>

        {/* Service Provider Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{appointment.serviceProvider.fullname}</Text>
          <Text style={styles.infoText}>Email: {appointment.serviceProvider.email}</Text>
          <Text style={styles.infoText}>Phone: {appointment.serviceProvider.phone}</Text>
          <Text style={styles.infoText}>{appointment.serviceProvider.serviceDetails.description}</Text>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.infoText}>{appointment.address.fullName}</Text>
          <Text style={styles.infoText}>{appointment.address.area}</Text>
          <Text style={styles.infoText}>{appointment.address.district}</Text>
          <Text style={styles.infoText}>{appointment.address.state} - {appointment.address.pincode}</Text>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <Text style={styles.infoText}>Service: {appointment.service.serviceName}</Text>
          <Text style={styles.infoText}>Date: {formatDate(appointment.date)}</Text>
          <Text style={styles.infoText}>Time: {appointment.time}</Text>
        </View>

        {/* Amount Breakdown Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount Breakdown</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.descriptionCell]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.tableCell, styles.amountCell]}>
                <Text>Amount (₹)</Text>
              </View>
            </View>
            {serviceRequest.quotation.amountBreakdown.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.descriptionCell]}>
                  <Text>{item.description}</Text>
                </View>
                <View style={[styles.tableCell, styles.amountCell]}>
                  <Text>{item.amount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.total}>
            <Text style={styles.totalText}>Total Amount: ₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.descriptionCell]}>
                <Text>Field</Text>
              </View>
              <View style={[styles.tableCell, styles.amountCell]}>
                <Text>Value</Text>
              </View>
            </View>
            {appointment.additionalDetails.map((detail, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.descriptionCell]}>
                  <Text>{detail.fieldName}</Text>
                </View>
                <View style={[styles.tableCell, styles.amountCell]}>
                  <Text>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Notes */}
        {appointment.additionalNotes && (
          <View style={styles.additionalInfo}>
            <Text style={styles.sectionTitle}>Additional Notes:</Text>
            <Text style={styles.infoText}>{appointment.additionalNotes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default MyDocument;