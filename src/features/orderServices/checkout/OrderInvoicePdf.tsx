import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import paidImage from "../../../assets/images/placeholder.svg";
import { OrderDetails } from "../../../types/OrderSchema";

/* -------------------- CONSTANTS -------------------- */
const ITEMS_PER_PAGE = 6;

/* -------------------- HELPERS -------------------- */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function formatDate(date: string) {
  return dayjs(date).format("ddd, MMM DD, YYYY");
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#444",
  },
  content: {
    padding: 40,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    flexDirection: "row",
    gap: 6,
    fontSize: 20,
    fontWeight: "bold",
  },
  receiptAmount: {
    color: "#1e88e5",
  },
  section: {
    marginBottom: 16,
    width: "60%",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 4,
  },

  label: {
    fontWeight: "bold",
    flexShrink: 0, // prevents label from shrinking
    flex: 1,
  },

  value: {
    flex: 2, // take remaining space
    text: "end", // align text to the right
    flexWrap: "wrap", // allow wrapping
  },

  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  table: {
    marginTop: 16,
    borderTop: "1px solid #e0e0e0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottom: "1px solid #ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
  },
  cell: {
    width: "20%",
    padding: 6,
  },
  summaryWrapper: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryTable: {
    width: "45%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

/* -------------------- COMPONENT -------------------- */
const OrderInvoicePdf = ({ orderDetails }: { orderDetails: OrderDetails }) => {
  const firstServiceOrder = orderDetails.serviceOrderDTOS[0];
  const user = firstServiceOrder?.userDetails;

  const allItems = orderDetails.serviceOrderDTOS.flatMap((serviceOrder) =>
    serviceOrder.items.map((item) => ({
      productName: item.product.nameEn,
      quantity: item.quantity,
      vendor: serviceOrder.service.nameEn,
      price: item.price,
    }))
  );

  const pages = chunkArray(allItems, ITEMS_PER_PAGE);

  return (
    <Document>
      {pages.map((items, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <View style={styles.content}>
              {/* ---------- HEADER ---------- */}
              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text>Receipt</Text>
                  <Text style={styles.receiptAmount}>
                    {orderDetails.totalAmount} {orderDetails.currency}
                  </Text>
                </View>
                <Image src="/logo.png" style={{ height: 60 }} />
              </View>

              {/* ---------- ORDER INFO (ONLY FIRST PAGE) ---------- */}
              {pageIndex === 0 && (
                <View style={styles.section}>
                  <InfoRow
                    label="Order Number"
                    value={orderDetails.orderNumber}
                  />
                  <InfoRow
                    label="Date"
                    value={formatDate(orderDetails.createdAt)}
                  />
                  <InfoRow
                    label="Client Name"
                    value={`${user?.firstName} ${user?.lastName}`}
                  />
                  <InfoRow label="Client Phone" value={user?.phoneNumber} />
                  <InfoRow label="Client Email" value={user?.email} />
                  <InfoRow
                    label="Delivery Address"
                    value={firstServiceOrder?.deliveryAddress}
                  />
                </View>
              )}

              {/* ---------- ITEMS TABLE ---------- */}
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.cell, styles.bold]}>Product</Text>
                  <Text style={[styles.cell, styles.bold]}>Qty</Text>
                  <Text style={[styles.cell, styles.bold]}>Vendor</Text>
                  <Text style={[styles.cell, styles.bold]}>Price</Text>
                  <Text style={[styles.cell, styles.bold]}>Amount</Text>
                </View>

                {items.map((item, index) => (
                  <View key={index} style={styles.tableRow} wrap={false}>
                    <Text style={styles.cell}>{item.productName}</Text>
                    <Text style={styles.cell}>{item.quantity}</Text>
                    <Text style={styles.cell}>{item.vendor}</Text>
                    <Text style={styles.cell}>
                      {item.price} {orderDetails.currency}
                    </Text>
                    <Text style={styles.cell}>
                      {item.price * item.quantity} {orderDetails.currency}
                    </Text>
                  </View>
                ))}
              </View>

              {/* ---------- SUMMARY (LAST PAGE ONLY) ---------- */}
              {isLastPage && (
                <View style={styles.summaryWrapper} wrap={false}>
                  <Image src={paidImage} />
                  <View style={styles.summaryTable}>
                    <SummaryRow
                      label="Subtotal"
                      value={orderDetails.totalSubtotal}
                      currency={orderDetails.currency}
                    />
                    <SummaryRow
                      label="Tax"
                      value={orderDetails.taxAmount}
                      currency={orderDetails.currency}
                    />
                    <SummaryRow
                      label="VAT"
                      value={orderDetails.vatAmount}
                      currency={orderDetails.currency}
                    />
                    <SummaryRow
                      label="Delivery"
                      value={orderDetails.totalDeliveryFee}
                      currency={orderDetails.currency}
                    />
                    <SummaryRow
                      label="Discount"
                      value={orderDetails.totalDiscount}
                      currency={orderDetails.currency}
                    />
                    <View style={styles.summaryRow}>
                      <Text style={styles.bold}>Total</Text>
                      <Text style={styles.bold}>
                        {orderDetails.totalAmount} {orderDetails.currency}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* ---------- FOOTER ---------- */}
            <View fixed style={styles.footer}>
              <Image
                src="data:image/png;base64,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"
                style={{
                  position: "absolute", // absolute positioning
                  bottom: -1, // stick to bottom
                  left: 0, // align to left
                  width: "100%", // full width
                  height: "auto", // maintain aspect ratio
                }}
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default OrderInvoicePdf;

/* -------------------- SMALL COMPONENTS -------------------- */
function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View style={styles.sectionRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  currency,
}: {
  label: string;
  value?: number | null;
  currency: string;
}) {
  if (!value || value <= 0) return null;
  return (
    <View style={styles.summaryRow}>
      <Text>{label}:</Text>
      <Text>
        {value} {currency}
      </Text>
    </View>
  );
}
