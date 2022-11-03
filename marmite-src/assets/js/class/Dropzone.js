/**
 *
 * Dropzone
 * Generic class for drag'n'drop input file multiple
 *
 * @author mha
 */

class Dropzone {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    let defaults = {
      container: '.file-upload',
      content: '.content-file-upload',
      cta: '.cta-file-upload',
      preview: '.preview-file-upload',
      dropzoneSettings: {},
      fallbackClassName: 'has-fallback'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.fileDropzone = null;

    this.init();
  }

  /**
   *
   * Init dropzone
   *
   */

  init() {
    let self = this;

    let calculatedSettings = {
      url: function() {
        const url = $('#url-file-upload').val();
        return url;
      },
      uploadMultiple: true,
      paramName: 'file', // The name that will be used to transfer the file
      clickable: self.settings.cta,
      parallelUploads: 100,
      maxFiles: 100,
      maxFilesize: 3,
      autoProcessQueue: true,
      previewsContainer: self.settings.preview,
      addRemoveLinks: true,
      dictInvalidFileType: 'Vous ne pouvez pas télécharger ce type de fichier.',
      dictFileTooBig: 'Ce fichier est trop lourd ({{filesize}} Mo). La taille maximum est {{maxFilesize}} Mo. Merci de télécharger un fichier plus léger.',
      dictResponseError: 'Il y a eu une erreur lors du chargement. Merci de réessayer.',
      dictCancelUpload: 'Annuler le chargement',
      dictCancelUploadConfirmation: 'Voulez-vous vraiment annuler le chargement de ce fichier ?',
      dictRemoveFile: 'Supprimer ce fichier',
      dictMaxFilesExceeded: 'Le nombre maximal de fichiers a été atteint.',
      init: function() {
        self.fileDropzone = this;
        self.fileDropzone.on('addedfile', function(file) {

        });
        self.fileDropzone.on('success', function(file, response) {
          $(file.previewElement).find('.dz-progress').remove();
          $('#url-file-sessionid').val(response.content.session_id);
          let filelist = $('#url-file-list').val();
          if(filelist!=='')filelist+=';';
          filelist+=file.name;
          $('#url-file-list').val(filelist);
        });
        self.fileDropzone.on('removedfile', function(file) {
          const session_id = $('#url-file-sessionid').val();
          $.ajax({
            url: $('#url-file-delete').val(),
            type: 'POST',
            data: {
              'name': file.name,
              'session_id':session_id
            }
          });
          const filelist = this.files;
          let namelist = '';
          for(let i = 0; i < filelist.length; i++){
            if(namelist!=='')namelist+=';';
            namelist+=filelist[i].name;
          }
          $('#url-file-list').val(namelist);
        });
      },
      fallback: function() {
        $(self.settings.container).addClass(self.settings.activeClassName);
      }
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    let currentSettings = $.extend({}, self.settings.dropzoneSettings, calculatedSettings);

    $(self.settings.content).dropzone(currentSettings);
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;

  }
}


module.exports = Dropzone;
