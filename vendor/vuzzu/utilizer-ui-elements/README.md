# utilizer-ui-elements
Library for WordPress admin, library of user interface elements, for a world with smart inputs.

To use the library on your next plugin, just load the init.php from functions.php or main plugin file.php
ex.: 

  require_once( trailingslashit( plugin_dir_path( __FILE__ ) ) . 'utilizer-ui-elements/init.php' );

After including the library, within your php files you can use current inputs functions:
- uz_ace_editor_input();
- uz_ajax_list_input();
- uz_categories_input();
- uz_checkbox_input();
- uz_color_picker_input();
- uz_date_picker_input();
- uz_file_input();
- uz_font_awesome_input(); // Requires library already loaded
- uz_google_fonts_input();
- uz_image_library_input();
- uz_select_input();
- uz_slider_input();
- uz_text_input();
- uz_textarea_input();
- uz_radio_input();
- uz_wp_editor_input();

You can see the inputs in action by installing this blank plugin on your WordPress installation: https://github.com/vuzzu/testblank-wp-plugin

![alt tag](http://utilizer.vuzzu.net/wp-content/uploads/sites/3/2015/04/utilizer-ui-elements-screenshot.png)
