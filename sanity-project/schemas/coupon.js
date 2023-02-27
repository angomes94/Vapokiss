export default {
    name: 'coupon',
    type: 'document',
    title: 'Coupon',
    fields: [
        {
            name: 'couponName',
            type: 'string',
            title: 'CouponName'
        }, {
            name: "discountPercentage",
            type: "number",
            title: "Discount %",
            validation: (Rule) => Rule.positive(),
            options: {
                decimalScale: 0,
                fixedDecimalScale: true,
                allowNegative: false,   
            }
        },{
            name: "discountAmount",
            type: "number",
            title: "Discount € ",
            validation: (Rule) => Rule.positive(),
            options: {
                decimalScale: 0,
                fixedDecimalScale: true,
                allowNegative: false,   
            }
        }

    ]
}