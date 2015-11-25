/// <reference path="../lib/photoswipe.d.ts" />
/// <reference path="../lib/jquery.d.ts" />
'use strict';
var PhotoSwipeLoad;
(function (PhotoSwipeLoad_1) {
    var PhotoSwipeLoad = (function () {
        function PhotoSwipeLoad(gid, galleryOptions, callback) {
            var _this = this;
            this.gid = gid;
            this.galleryOptions = galleryOptions;
            this.callback = callback;
            this.EphotoGalleryPhotoSizes = {
                240: 'm',
                320: 'n',
                640: 'z',
                800: 'c',
                1024: 'b',
                1600: 'h',
                2048: 'k',
                2400: 'o' // do not comment this out.
            };
            this.currentSize = parseInt(Object.keys(this.EphotoGalleryPhotoSizes)[0], 10); //start with smallest size
            this.firstResize = true;
            this.initGalleryWithCallback = function (callback) {
                callback = callback || function () { };
                if (!_this.EphotoGalleryData || !_this.galleryOptions) {
                    return 'You have to initialize everything.';
                }
                if (!_this.gallery) {
                    _this.initGallery(_this.EphotoGalleryData, _this.galleryOptions);
                }
                callback(_this.gallery);
            };
            this.loadMoreCallback = function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var $loadMore = $("#loadMore");
                var $moreContent = $('#moreContent'), url = $loadMore.get(0).href;
                var $lastElement = $moreContent.prev();
                $.get(url, function (data) {
                    $moreContent.replaceWith(data);
                }).then(function (data, textStatus, jqXHR) {
                    var i = ((_this.gallery ? _this.gallery.items : _this.EphotoGalleryData) || []).length;
                    for ($lastElement = ($lastElement.length == 0) ? $(".my-gallery").children().first() : $lastElement.next(); ($lastElement.get(0) != undefined); $lastElement = $lastElement.next()) {
                        var that = _this;
                        var photoLink = $lastElement.children("a");
                        photoLink.on("click", function (evt) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            var ind = this.parentNode.attributes.getNamedItem('data-pswp-uid').value;
                            if (!that.gallery) {
                                that.galleryOptions.index = ind;
                                that.initGallery(that.EphotoGalleryData, that.galleryOptions);
                                that.callback(that.gallery);
                            }
                            that.gallery.invalidateCurrItems();
                            that.gallery.goTo(parseInt(ind));
                        });
                        var photoData = photoLink.data("size");
                        if (photoData) {
                            $lastElement.attr('data-pswp-uid', i++);
                            var sizeSplit = photoLink.data("size").split("x");
                            var heightRatio = parseFloat(sizeSplit[1]) / parseFloat(sizeSplit[0]);
                            var item = { src: "", w: 0, h: 0, sizeData: {} };
                            var size, ext, sizes = _this.EphotoGalleryPhotoSizes;
                            for (size in sizes) {
                                ext = sizes[size];
                                var photo = (photoLink.children("img").get(0));
                                var w = heightRatio <= 1 ? parseFloat(size) : parseFloat(size) * heightRatio;
                                var h = heightRatio > 1 ? parseFloat(size) : parseFloat(size) * heightRatio;
                                item.sizeData[ext] = {
                                    src: photo.src.replace("m_", ext + "_"),
                                    w: w,
                                    h: h,
                                };
                                item.original_src = photoLink.get(0).href.replace("o_", "");
                            }
                            _this.EphotoGalleryData.push(item);
                        }
                    }
                    $("#loadMore").on('click', _this.loadMoreCallback);
                });
            };
            this.initGallery = function (data, galleryOptions) {
                // Initializes and opens PhotoSwipe
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, data, galleryOptions);
                // beforeResize event fires each time size of gallery viewport updates
                gallery.listen('beforeResize', function () {
                    // gallery.viewportSize.x - width of PhotoSwipe viewport
                    // gallery.viewportSize.y - height of PhotoSwipe viewport
                    // window.devicePixelRatio - heightRatio between physical pixels and device independent pixels (Number)
                    //                          1 (regular display), 2 (@2x, retina) ...
                    var newSize = 0;
                    var imageSrcWillChange = false;
                    var realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio; // calculate real pixels when size changes
                    for (var size in _this.EphotoGalleryPhotoSizes) {
                        if (realViewportWidth > size) {
                            newSize = parseInt(size, 10);
                        }
                    }
                    if (_this.currentSize < newSize) {
                        imageSrcWillChange = true;
                        _this.currentSize = newSize;
                    }
                    // Invalidate items only when source is changed and when it's not the first update
                    if (imageSrcWillChange && !_this.firstResize) {
                        // invalidateCurrItems sets a flag on slides that are in DOM, which will force update of content (image) on window.resize.
                        gallery.invalidateCurrItems();
                    }
                    _this.firstResize = false;
                });
                // gettingData event fires each time PhotoSwipe retrieves image source & size
                gallery.listen('gettingData', function (index, item) {
                    // Set image source & size based on real viewport width
                    var ext = _this.EphotoGalleryPhotoSizes[_this.currentSize];
                    item.src = item.sizeData[ext].src || item['o'].src;
                    item.w = item.sizeData[ext].w || item['o'].w;
                    item.h = item.sizeData[ext].h || item['o'].h;
                    // It doesn't really matter what will you do here, as long as item.src, item.w and item.h have valid values.
                    //
                    // Just avoid http requests in this listener, as it fires quite often
                });
                gallery.listen('destroy', function () {
                    _this.gallery = undefined;
                });
                _this.gallery = gallery;
            };
            this.init = function () {
                _this.galleryOptions = _this.galleryOptions || {};
                if (!('getImageURLForShare' in _this.galleryOptions)) {
                    _this.galleryOptions.getImageURLForShare = function (shareButtonData) {
                        return this.gallery.currItem.original_src || this.gallery.currItem.src || '';
                    };
                }
                _this.callback = _this.callback || function () { };
                $("#loadMore").on('click', _this.loadMoreCallback);
                if (!_this.EphotoGalleryData) {
                    _this.EphotoGalleryData = [];
                    $("#loadMore").click();
                }
            };
            this.init();
        }
        return PhotoSwipeLoad;
    })();
    PhotoSwipeLoad_1.PhotoSwipeLoad = PhotoSwipeLoad;
    ;
})(PhotoSwipeLoad || (PhotoSwipeLoad = {}));
