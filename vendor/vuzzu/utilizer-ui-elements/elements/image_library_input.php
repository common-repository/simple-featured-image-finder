<?php

/*************************************************
* Utilizer ui elements: image library input
**************************************************/
function uz_image_library_input($label,$input_name,$input_value,$multi=false) {

	if( is_array($input_value) ) :
		$all_images = '';
		foreach ($input_value as $_image) :
			$all_images .= "$_image,";
		endforeach;
		$input_value = remove_last_char( $all_images );
	endif;

	?>

		<div class="uz_input">

			<label> <?php echo $label; ?> </label>

			<div class="image-library <?php if($multi) echo 'multi'; ?> " data-actual="<?php echo $input_value; ?>" data-name="<?php echo $input_name; ?>">

				<div class="inner"> <i class="fa fa-spinner fa-spin"></i> </div>

				<div class="arrows">
					<a href="#" data-go="prev"> <i class="fa fa-angle-up fa-2x"></i> </a>
					<a href="#" data-go="next"> <i class="fa fa-angle-down fa-2x"></i> </a>
				</div>

			</div>

		</div>

	<?php

}


/*-----------------------------------------------------------------------------------*/
/* Ajax request response
/*-----------------------------------------------------------------------------------*/
add_action('wp_ajax_uz_ui_load_more_images', 'uz_ui_load_more_images');
function uz_ui_load_more_images() {

	global $wpdb;

	$offset = esc_sql( $_GET['offset'] );
	$offset = ($offset) ? $offset * 25 : 0;
	$images = $wpdb->get_results(" SELECT ID FROM $wpdb->posts WHERE post_type = 'attachment' AND post_mime_type LIKE 'image%' ORDER BY post_date DESC LIMIT {$offset},25 ");

	foreach($images as $key => $image) {
		$images[$key]->url = wp_get_attachment_url( $image->ID );
	}


	if( count($images)>0 ) :
		echo json_encode($images);
	endif;

	die();

}


?>
