function getEach(objectStr) {
    var objs = [];
    Crafty(objectStr).each(function() {
        console.log(this);
        objs.push(this);
    });
    return objs;
}