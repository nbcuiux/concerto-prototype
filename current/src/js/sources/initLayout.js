function initLayout() {
    var pageName = window.location.href.split('/').pop().split('.').shift();

    switch (pageName) {
        /*case 'create-season' :
            new CardsPlacement(pageSctructures.season);
            break;

        case 'create-event' :
            new CardsPlacement(pageSctructures.event);
            break;

        case 'create-series' :
            new CardsPlacement(pageSctructures.series);
            break;

        case 'create-episode' :
            new CardsPlacement(pageSctructures.episode);
            break;*/
        /*    
        case 'create-collection':
            new CardsPlacement(pageSctructures.collection);
            break;

        case 'hero-collection':
            new CardsPlacement(pageSctructures.collection);
            break;
*/
        case 'create-masterCollection' :
            new CardsPlacement(pageSctructures.masterCollection);
            break;

        default:

    }
}
