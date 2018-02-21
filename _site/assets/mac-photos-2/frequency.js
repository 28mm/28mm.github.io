function freq_activate(selector, json_url) {


    d3.json(json_url, function(error, data) {


        data.forEach(function(item) {
            item.sort = 100000 - item.freq;
        });
        $(selector).selectize({
            sortField: 'sort',
            maxItems: 1,
            create: false,
            multiple: false,
            maximumSelectionSize: 1,
            valueField: 'name',
            labelField: 'name',
            searchField: ['provider', 'name'],
            options: data,
            render: {
                item: function(item, escape) {
                    console.log(item);
                    return '<div><span class="' + (item.provider == 'photos.app' ? 'photos' : item.provider ) + '">' + item.freq + '</span><span>' + item.name + '</span></div>' ;
                },
                option: function(item, escape) {
                    console.log(item);
                    return '<div><span class="' + (item.provider == 'photos.app' ? 'photos' : item.provider ) + '">' + item.freq + '</span><span>' + item.name + '</span></div>' ;
                }
            }
        });

    });

}