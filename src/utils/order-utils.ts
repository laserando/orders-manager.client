import {Order} from "../app/models/order.model";

export async function filterOrder() {
  const orders = await this.orderService.find(this.filter, null, 0, 1000);

  const filterOrders = (order: Order, terms: string) => {
    terms = terms.trim().replace(/ /g, "");
    if (order.clientIndications?.toLowerCase().includes(terms.toLowerCase())) {
      return true;
    }
    if ((order.client.name + order.client.surname +( order.typesOfProcessing?.name || "") + (order.typesOfMaterial?.name || "")).toLowerCase().includes(terms.toLowerCase())) {
      return true;
    }
  }
  const checked = orders.filter((order) => filterOrders(order, this.term));

  //
  // if (checked.length === 0) {
  //   this.orders = await this.orderService.find(this.filter, null, 0, 20);
  // } else {
  return checked;
}
