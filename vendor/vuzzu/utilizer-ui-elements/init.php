<?php

/*****************************************************
* Utilizer ui elements, library for wp-admin plugins
******************************************************/

// In case used by multiple plugins
if( !defined( "UTILIZER_UI_ELEMENTS_DIR" ) ) :

	// Constants
	define( 'UTILIZER_UI_ELEMENTS_DIR',	dirname(__FILE__) );
	define( 'UTILIZER_UI_ELEMENTS_URI',	trailingslashit( plugin_dir_url( __FILE__ ) ) );

	// Loading all elements
	$elements_path_list = glob( UTILIZER_UI_ELEMENTS_DIR . "/elements/*.php");

	foreach ( $elements_path_list as $element_path ) {

		if( file_exists( $element_path ) )
		{
			require_once $element_path;
		}

	}

	// Enqueing scripts and styles
	add_action('admin_enqueue_scripts', 'uz_ui_assets', 0);
	function uz_ui_assets() {

		# JAVASCRIPTS

			// Registering js assets
			wp_register_script( 'ace-editor', UTILIZER_UI_ELEMENTS_URI . "assets/js/ace.js", false, "1.1.01", true );
			wp_register_script( 'jquery-ui-combobox', UTILIZER_UI_ELEMENTS_URI . "assets/js/jquery-ui.combobox.js", false, "1.0", true );
			wp_register_script( 'utilizer-ui-elements', UTILIZER_UI_ELEMENTS_URI . "assets/js/script.js", false, "1.0", true );
			wp_enqueue_media();

			// Loading js assets
			wp_enqueue_script(
				array(
					'iris',
					'json2',
					'jquery',
					'jquery-ui-core',
					'jquery-ui-slider',
					'jquery-ui-autocomplete',
					'jquery-ui-datepicker',
					'jquery-ui-combobox',
					'ace-editor',
					'utilizer-ui-elements',
				)
			);

			$categories = array();

			$categories_obj = get_categories( array('type'=>'post') );
			foreach ($categories_obj as $cobj) {
				$categories[$cobj->cat_ID] = $cobj->name;
			}

			$uz_ui = array( 'cats' => $categories, 'uri' => UTILIZER_UI_ELEMENTS_URI );

			wp_localize_script( 'utilizer-ui-elements', 'uz_ui', $uz_ui );

		# Cascading Style Sheets

			// Registering css assets
			wp_register_style( 'font-awesome', "//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css", false, "4.3.0", "all" );
			wp_register_style( 'google-roboto-font', "http://fonts.googleapis.com/css?family=Roboto:400,700,500", false, "1.0", "all" );
			wp_register_style( 'jquery-ui-mod', UTILIZER_UI_ELEMENTS_URI . 'assets/css/jquery-ui.mod.css', false, "1.10.0", "all");
			wp_register_style( 'utilizer-ui-elements', UTILIZER_UI_ELEMENTS_URI . 'assets/css/style.css', false, "1.0", "all");

			// Enqueuing css assets
			wp_enqueue_style( array( 'thickbox', 'font-awesome', 'google-roboto-font', 'jquery-ui-mod', 'utilizer-ui-elements' )  );

	}

endif;
