const printInvoice = (obj, params={_id:null , session:null , monthlySubscription:null}) => {
    const invoiceQuery = {
        _id: $(obj).attr("orderID") || params._id || null,
    }
    if(invoiceQuery._id == null){
        delete invoiceQuery._id
    }
    if(invoiceQuery.session == null){
        delete invoiceQuery.session
    }
    if(invoiceQuery.MonthlySubscription == null){
        delete invoiceQuery.MonthlySubscription
    }

    var queryString = Object.keys(invoiceQuery).map(key => key + '=' + invoiceQuery[key]).join('&');

    const newWindow = window.open(`${window.location.origin}/order/print?${queryString}`, 'hhgh', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    newWindow.print()
    newWindow.onafterprint = () => {
        window.location = window.location.href
        newWindow.close()
    }
}
const linkPrintInvoiceEventTrigger = () => {

    $('.printOrder').on('click', function (e) {
        e.preventDefault();
        printInvoice(this)

    })

}

linkPrintInvoiceEventTrigger()
