
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');

var EditFileOverlay = class EditFileOverlay extends React.Component {
  constructor(props) {
    super();
    this.state={
      isVisible: false
    }
  }

  componentDidMount() {

  }

  render() {

    var fileData = this.props.fileData;

    return (
      <div className="pr hidden modal--full theme--dark">
        <div className="modal__close" id='fpTopCloseButton'></div>
        <div className="images images_style_bulk">
          <i className="fa fa-chevron-left images__scroll-left"></i>
          <div className="images__wrapper" id="images__wrapper">
            <div className="images__container"></div>
          </div>
          <i className="fa fa-chevron-right images__scroll-right"></i>
        </div>
        <div className="preview" id="filePreview">
          <div className="preview__image" id="previewImage">
            <div className="preview__image-wrapper">
              <img src="" id="previewImg" className="preview__image-img" />
              <div className="preview__focal-point is-hidden" id="focalPoint"></div>
              <div className="preview__focal-rect is-hidden" id="focalRect"></div>
              <div className="preview__video-play" id="videoPlay"></div>
            </div>
          </div>
          <div className="preview__controls" id="previewControls">
            <button className="button button_style_outline-white" id="focalPointToggle">Focal Point</button>
            <button className="button button_style_outline-white" id="focalRectToggle">Focal Rectangle</button>
          </div>

          <div className="purposes is-hidden" id="purposes">
            <div className="purpose__header">
              <input type="text" className="js-input input__field_style_dark" data-label="Search Preview" placeholder="Type preview name" />
              <div className="right">
                <div className="purpose-paginator" id="p-paginator"></div>
                <button className="button button_style_transparent-white" id="showPreview"><i className="fa fa-arrow-up"></i><span> View All</span></button>
              </div>
            </div>
            <i className="purposes__left fa fa-chevron-left" id="scrollLeft"></i>
            <div className="purposes__wrapper" id="purposeWrapper">
              <div className="purposes__container">
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover HTC</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover HTC (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover LG</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">Android cover LG (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-2 purpose-img"></div>
                  <div className="purpose-title">Android wide cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-2 purpose-img"></div>
                  <div className="purpose-title">Android wide cover (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-3 purpose-img"></div>
                  <div className="purpose-title">Android widest cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-3 purpose-img"></div>
                  <div className="purpose-title">Android widest cover (grayscale)</div>
                </div>

                {/* Desktop */}
                <div className="purpose">
                  <div className="pr-4 purpose-img"></div>
                  <div className="purpose-title">Desktop header</div>
                </div>
                <div className="purpose">
                  <div className="pr-5 purpose-img"></div>
                  <div className="purpose-title">Desktop header (widescreen)</div>
                </div>
                <div className="purpose">
                  <div className="pr-6 purpose-img"></div>
                  <div className="purpose-title">Desktop header (widest)</div>
                </div>
                <div className="purpose">
                  <div className="pr-7 purpose-img"></div>
                  <div className="purpose-title">Desktop side cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-8 purpose-img"></div>
                  <div className="purpose-title">Desktop side cover (narrow)</div>
                </div>
                <div className="purpose">
                  <div className="pr-9 purpose-img"></div>
                  <div className="purpose-title">Desktop side cover (tight)</div>
                </div>
                <div className="purpose">
                  <div className="pr-10 purpose-img"></div>
                  <div className="purpose-title">Desktop side cover (line)</div>
                </div>
                <div className="purpose">
                  <div className="pr-11 purpose-img"></div>
                  <div className="purpose-title">Desktop square 500</div>
                </div>
                <div className="purpose">
                  <div className="pr-11 purpose-img"></div>
                  <div className="purpose-title">Desktop square 550</div>
                </div>
                <div className="purpose">
                  <div className="pr-11 purpose-img"></div>
                  <div className="purpose-title">Desktop square 600</div>
                </div>

                {/* iOS */}
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover retina</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover retina (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover 6 plus</div>
                </div>
                <div className="purpose">
                  <div className="pr-1 purpose-img"></div>
                  <div className="purpose-title">iOS cover 6 plus (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-2 purpose-img"></div>
                  <div className="purpose-title">iOS wide cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-2 purpose-img"></div>
                  <div className="purpose-title">iOS wide cover (grayscale)</div>
                </div>
                <div className="purpose">
                  <div className="pr-3 purpose-img"></div>
                  <div className="purpose-title">iOS widest cover</div>
                </div>
                <div className="purpose">
                  <div className="pr-3 purpose-img"></div>
                  <div className="purpose-title">iOS widest cover (grayscale)</div>
                </div>
              </div>
              <div className="c-Purposes-footer u-visible-xs">
                <button className="button button_style_outline-white u-noMargin" id="loadMore">Load More</button>
              </div>
            </div>
            <i className="purposes__right fa fa-chevron-right" id="scrollRight"></i>
          </div>
        </div>
        <div className="ip">
          <div className="ip__title" id="ip__title">Metadata</div>
          <div id="imageMetadata">
            <div className="ip__group">
              <div className="controls__group" id="imageTittleField">
                <input type="text"
                value={fileData.title}
                id="title"
                className="js-input input__field_style_dark js-required"
                required="true"
                data-label="Image Title"
                data-err-msg=" Please enter a title for the image"
                data-theme="dark" />
              </div>
              <div className="controls__group">
                <input type="text"
                value={fileData.caption}
                id="caption"
                className="js-input input__field_style_dark"
                data-label="Image Caption"
                data-help-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales commodo cursus."
                data-theme="dark" />
              </div>
              <div className="controls__group">
                <textarea type="text"
                value={fileData.description}
                id="description"
                className="js-input input__field_style_dark"
                data-label="Image Description"
                data-help-text="Fusce sodales finibus auctor. Nunc ipsum turpis, porttitor non sem id, luctus tincidunt diam."
                data-theme="dark"></textarea>
              </div>
              <div className="controls__group img-only">
                <input value={fileData.highResolution} type="checkbox" className="toggle toggle_style_dark" id="resolution" />
                <label for="resolution">High Resolution<span className="ad-info">2400×1400</span></label>
              </div>
            </div>

             {/* Group of controls */}
            <div className="ip__group">
              <div className="controls__group">
                <div className="js-tagfield tagfield_style_dark"
                data-label="Categories"
                data-items='["Backstage", "Episode Recap", "Red Carpet", "Fun Facts"]'
                data-placeholder="Set Categories"
                data-theme="dark"></div>
              </div>
              <div className="controls__group">
                <div className="js-tagfield tagfield_style_dark"
                data-label="Tags"
                data-items='["Adam Copeland", "Emily Rose", "Eric Balfour", "John Dunsworth", "Laura Mennell", "Lucas Bryant", "Richard Donat"]'
                data-placeholder="Set Tags"
                data-create-new-tag="true"
                data-search-placeholder="Type a tag..."></div>
              </div>
            </div>

            <div className="ip__group">
              <div className="controls__group">
                <input value={fileData.altText} type="text" id="altText" className="js-input input__field_style_dark" data-label="Alt Text" />
              </div>
              <div className="controls__group">
                <input type="text" id="credit" className="js-input input__field_style_dark" data-label="Credit" />
              </div>
              <div className="controls__group">
                <input type="text" id="copyright" className="js-input input__field_style_dark" data-label="Copyright" />
              </div>
              <div className="controls__group">
                <input type="text" id="source" className="js-input input__field_style_dark" data-label="Source" />
              </div>
              <div className="controls__group">
                <div className="cg__title cg__title_style_dark">Association</div>
                <div className="cg__controls cg__controls_style_col">
                  <div className="cg__control cg__control_style_col">
                    <div className="js-selectbox selectbox_style_dark"
                    data-label="Series"
                    data-items='["The Tonight Show", "The Robot", "Blindspot", "Law & Order"]'
                    data-placeholder="Select Series"></div>
                  </div>
                  <div className="cg__control cg__control_style_col">
                    <div className="js-selectbox selectbox_style_dark"
                    data-label="Season"
                    data-items='["01", "02", "03", "04", "05", "06", "07", "08", "09"]'
                    data-placeholder="Select Season"></div>
                  </div>
                  <div className="cg__control cg__control_style_col">
                    <div className="js-selectbox selectbox_style_dark"
                    data-label="Episode"
                    data-items='["1. It is a Fae Fae Fae Fae World", "2. Where There is a Will, There is a Fae", "3. Oh Kappa, My Kappa", "4. Faetal Attraction", "5. Dead Lucky", "6. Food For Thought", "7. Arachnofaebia", "8. Vexed", "9. Fae Day", "10. The Mourning After", "11. Faetal Justice", "12. (Dis)Members Only", "13. Blood Lines"]'
                    data-placeholder="Select Episode"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden" id="videoMetadata">
            <div className="ip__group">
              <div className="controls__group">
                <div className="js-selectbox selectbox_style_dark"
                data-label="Videoplayer"
                data-items='["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]'
                data-placeholder="Select videoplayer"></div>
              </div>
            </div>
            <div className="ip__group" id="fielEdit-videoMetadata">
              <div className="controls__group">
                <div className="text-group text-group--dark">
                  <div className="text-group__title">Title</div>
                  <div className="text-group__text" id="videoTitle"></div>
                </div>
                <div className="text-group text-group--dark">
                  <div className="text-group__title">Description</div>
                  <div className="text-group__text" id="videoDescription"></div>
                </div>
                <div className="text-group text-group--dark">
                  <div className="text-group__title">Author</div>
                  <div className="text-group__text" id="videoAuthor"></div>
                </div>
                <div className="text-group text-group--dark">
                  <div className="text-group__title">GUID</div>
                  <div className="text-group__text" id="videoGuid"></div>
                </div>
                <div className="text-group text-group--dark">
                  <div className="text-group__title">Keywords</div>
                  <div className="text-group__text" id="videoKeywords"></div>
                </div>
              </div>
            </div>
            <div className="ip__title">Promotional</div>
            <div className="ip__group">
              <div className="controls__group">
                  <input type="text" id="promotional-kicker" className="js-input input__field_style_dark" data-label="Promotional Kicker" data-theme="dark" />
              </div>
              <div className="controls__group">
                  <input type="text" id="promotional-title" className="js-input input__field_style_dark" data-label="Promotional Title" data-theme="dark" />
              </div>
              <div className="controls__group">
                  <textarea id="promotional-description" className="js-input input__field_style_dark" data-label="Promotional Description" data-theme="dark"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="modal__controls modal__controls--bottom modal__controls--file-edit">
          <button className="button button_style_fill-accent" id="saveChanges">Save</button>
          <button className="button button_style_outline-white" id="cancelChanges">Cancel</button>
        </div>
      </div>
    );
  }
}

module.exports = EditFileOverlay;