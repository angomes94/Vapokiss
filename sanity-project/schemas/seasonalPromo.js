export default {
    name: 'seasonalPromo',
    title: 'SeasonalPromo',
    type: 'document',
    fields: [
        {
            name: 'seasonalPromo',
            title: 'seasonalPromo',
            type: "string"

        },{
            name: 'promoText',
            title: 'PromoText',
            type: 'object',
            fields: [
                {
                  name: 'textArray',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
                {
                  name: 'colorArray',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ]
        }, {
            name: "isValid",
            title: "IsValid",
            type: "boolean"
        }
    ]
};