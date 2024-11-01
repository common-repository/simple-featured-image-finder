<?php

/*

Plugin Name: Simple Featured Image Finder
Description: An easy solution to featured images by Unsplash API
Version: 1.0
Author: mentorgashi
Author URI: http://mentorgashi.com
Plugin URI: https://github.com/mentorgashi/simple-featured-image-finder
License: GPL v.2.0

*/

class MentorGashi_Simple_Featured_Image_Finder {

	function __construct() {
	    if( is_admin() ) {
			add_action( 'plugins_loaded', array( &$this, 'translation' ) );
			add_action( 'admin_init', array( $this, 'admin_register_settings' ) );
			require_once trailingslashit( plugin_dir_path( __FILE__ ) . "vendor" ) . '/vuzzu/utilizer-ui-elements/init.php';
			require_once trailingslashit( plugin_dir_path( __FILE__ ) ) . "simple-featured-image-finder-settings-page.php";
			add_action( 'admin_menu', array( $this, 'admin_panel' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_sfif_scripts' ) );
			add_action( 'wp_ajax_sfif_search_images', array( $this, 'admin_sfif_ajax_response' ) );
			add_action( 'wp_ajax_sfif_select_image', array( $this, 'admin_sfif_download_image' ) );
	    }
	}

	public function translation() {
		load_plugin_textdomain( 'sfif_terms', false, trailingslashit( plugin_dir_path( __FILE__ ) . 'languages' ) );
		$locale = get_locale();
		$locale_file = trailingslashit( plugin_dir_path( __FILE__ ) . 'languages' ) . $locale . ".php";
		if ( is_readable( $locale_file ) ) {
			require_once( $locale_file );
		}
	}

	public function admin_register_settings() {
    	register_setting( 'sfif-settings-group', 'simple_featured_image_finder_support_types' );
    	register_setting( 'sfif-settings-group', 'sfif_unsplash_client_id' );
	}

	public function admin_panel() {
		add_options_page(
			__('Simple Featured Image Finder Settings','sfif_terms'),
			__('Simple Featured Image Finder','sfif_terms'),
			'manage_options',
			'sfif-settings',
			'mentorgashi_sfif_admin_settings_view'
		);
	}

	public function admin_sfif_scripts() {
		wp_register_script( 'sfif_admin_scripts', plugin_dir_url( __FILE__ ) . 'simple-featured-image-finder.js' );
		wp_enqueue_style( 'sfif-style', plugin_dir_url( __FILE__ ) . 'simple-featured-image-finder.css', false, "1.0", "all" );
		wp_localize_script( 'sfif_admin_scripts', 'mentorgashi_sfif',
			array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'nonce' => wp_create_nonce( "sfif_search_images_nonce" ), 'nonce2' => wp_create_nonce( "sfif_select_image_nonce" ) ) );
		wp_enqueue_script( 'sfif_admin_scripts' );
	}

	public function admin_sfif_ajax_response() {
		check_ajax_referer( 'sfif_search_images_nonce', 'nonce' );
		if( true ) {
			$client_id = get_option('sfif_unsplash_client_id');
			if($client_id) {
				$page = (isset($_POST['page']) && is_int(intval($_POST['page']))) ? intval($_POST['page']) : 1;
				$query = (isset($_POST['query'])) ? urlencode(strtolower(sanitize_text_field($_POST['query']))) : "";

		    	$context_params = array(
		    		'http' => array(
		    			'method'  => 'GET',
		    			'header'  => 'Content-type: application/json'
		    		)
		    	);

		    	$unsplash_url = "https://api.unsplash.com/search/photos";
		    	$search_url = $unsplash_url . "?query=" . $query . "&client_id=" . $client_id . "&page=".$page;

		    	$request_context  = stream_context_create($context_params);
		    	$unsplash_response = file_get_contents($search_url, false, $request_context);

		    	if($unsplash_response) {
		    		$response_object = json_decode($unsplash_response);
		    		$response_content = "";
		    		
		    		foreach ($response_object->results as $imageObject) {
		    			$response_content .= '<li class="image-suggestion"> <div class="select-image"> <img src="'.$imageObject->urls->thumb.'" /> <span class="set-featured" data-raw="'.$imageObject->urls->raw.'"> <i class="fa fa-check"></i> Set featured image </span> <a href="'.$imageObject->links->html.'" target="_blank"> <i class="fa fa-external-link"></i> View at Unsplash </a> </div> </li>';
		    		}

		    		echo intval($response_object->total) . "||" . $this->__filter_images_list_html($response_content);
		    	}
		    } else {
		    	echo "Please setup your Unsplash APP ID!";
		    }
			
		}
		wp_die();
	}

	public function admin_sfif_download_image() {
		check_ajax_referer( 'sfif_select_image_nonce', 'nonce' );
		if( true ) {

			$image_url = (isset($_POST['raw_url'])) ? esc_url($_POST['raw_url']) : null;
			$post_id = (isset($_POST['post_id']) && is_int(intval($_POST['post_id']))) ? intval($_POST['post_id']) : null;

			if($image_url && $post_id) {
				$wp_upload_dir = wp_upload_dir();
				$image_content = wp_remote_retrieve_body(wp_remote_get($image_url, array( 'timeout' => 120 )));
				$image_random_name = substr(md5(strtotime('now')),0,15).".jpg";
				$image_file_path = $wp_upload_dir['path'] . "/" . $image_random_name;
				$filedata = fopen($image_file_path, "w");
				fwrite($filedata, $image_content);
				fclose($filedata);

				$filetype = wp_check_filetype( basename( $image_file_path ), null );

				$attachment = array(
					'guid'           => $wp_upload_dir['url'] . '/' . basename( $image_file_path ), 
					'post_mime_type' => $filetype['type'],
					'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $image_file_path ) ),
					'post_content'   => '',
					'post_status'    => 'inherit'
				);

				$attachment_id = wp_insert_attachment( $attachment, $image_file_path, $post_id );
				require_once( ABSPATH . 'wp-admin/includes/image.php' );
				$attachment_data = wp_generate_attachment_metadata( $attachment_id, $image_file_path );
				wp_update_attachment_metadata( $attachment_id, $attachment_data );
				set_post_thumbnail( $post_id, $attachment_id );

				$thumbnail_url = wp_get_attachment_thumb_url($attachment_id);

				$return_content = '<p class="hide-if-no-js"><a href="'.admin_url('/media-upload.php?post_id='.$post_id.'&amp;type=image&amp;TB_iframe=1&amp;width=753&amp;height=101').'" id="set-post-thumbnail" aria-describedby="set-post-thumbnail-desc" class="thickbox"><img src="'.$thumbnail_url.'" class="attachment-266x266 size-266x266"></a></p><p class="hide-if-no-js howto" id="set-post-thumbnail-desc">Click the image to edit or update</p><p class="hide-if-no-js"><a href="#" id="remove-post-thumbnail">Remove featured image</a></p><input type="hidden" id="_thumbnail_id" name="_thumbnail_id" value="'.$attachment_id.'">';

				echo $this->__filter_featured_image_html($return_content);
			}
		}
		wp_die();
	}

	protected function __filter_images_list_html($content) {
		$allowed_html = [
			'li' => [ 'class'  => [], ],
			'div' => [ 'class'  => [], ],
			'img' => [ 'src' => [], ],
			'span' => [ 'class'  => [], 'data-raw'  => [], ],
			'i' => [ 'class'  => [], ],
			'a' => [ 'href'  => [], 'target'  => [], ],
		];

		return wp_kses( $content, $allowed_html );
	}

	protected function __filter_featured_image_html($content) {
		$allowed_html = [
			'p' => [ 'class'  => [], 'id'  => [], ],
			'a' => [ 'href'  => [], 'id'  => [], 'class'  => [], 'aria-describedby'  => [], ],
			'img' => [ 'src' => [], 'class' => [], ],
			'input' => [ 'type'  => [], 'id'  => [], 'name'  => [], 'value'  => [],],
		];

		return wp_kses( $content, $allowed_html );
	}
}

new MentorGashi_Simple_Featured_Image_Finder();