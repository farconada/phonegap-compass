var app = angular.module('myApp', ['d3', 'PhoneGap']);
app.controller('MainController', function($scope, Compass){
    $scope.angulo = 0;
    Compass.watchHeading(
        function(heading){
            console.log(heading);
            $scope.$apply(
                function(){
                    $scope.angulo = heading.magneticHeading;
                }
            );
        },
        function(error){
            console.log(error);
        },
        { frequency: 1000}
    );

    $scope.rota = function () {
        console.log('rota()');
    };
});

app.directive('compass', function(d3Service){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs) {
            var scaleFactor = function(element, bbox) {
                console.log('Parent H:' + element.clientHeight);
                console.log('Parent W:' + element.clientWidth);
                if ((element.clientWidth/bbox.width) * bbox.height > element.clientHeight) {
                    return (element.clientHeight/bbox.height) - 0.02;
                }
                return (element.clientWidth/bbox.width) - 0.02;
            };

            d3Service.d3().then(function(d3) {
                d3.xml(attrs.svgFile, "image/svg+xml", function(xml) {
                    var importedNode = document.importNode(xml.documentElement, true);
                    d3.select(element[0]).node().appendChild(importedNode);
                    d3.select(element[0].childNodes[0]).attr('width', '100%');
                    d3.select(element[0].childNodes[0]).attr('height', '100%');;
                    scale = scaleFactor(element[0].childNodes[0], d3.select('#reloj').node().getBBox());
                    d3.select('#reloj').attr('transform', 'scale('+scale+')');
                });

                attrs.$observe("angle", function(newValue){
                    var aguja = d3.select('#aguja');
                    if (aguja.node()) {
                        var bbox = aguja.node().getBBox();
                        var ch = bbox.y + bbox.height/2;
                        var cw = bbox.x + bbox.width/2;
                        var transform = aguja.attr("transform");
                        transform = transform.replace(/rotate(.*)/g, '');
                        var rotate = ' rotate(' + newValue+ ', ' + ch +','+ cw +')';
                        aguja.attr("transform", transform + rotate);
                    }
                });
            });

        }
    }
});
