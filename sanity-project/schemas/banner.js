export default {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true
            }
        }, {
            name: 'name',
            title: 'Name',
            type: 'string'
        }, {
            name: 'midText',
            title: 'MidText',
            type: 'string'
        }, {
            name: 'largeText',
            title: 'LargeText',
            type: 'string'
        }
    ]
};