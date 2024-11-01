<?php

/*************************************************
* Utilizer ui elements: file input
**************************************************/
function uz_file_input($label,$input_name,$input_value) {

	$label_string = "label_{$input_name}";

	if(isset($input_value)) {

		if( @GetImageSize( $input_value ) ) :

			$imageShow = '<img src="'.$input_value.'" />';

			$res = GetImageSize( $input_value );
			$_image_size_desc  = __('Width:', 'uz_terms') . $res[0] . 'px, ';
			$_image_size_desc .= __('Height:', 'uz_terms') . $res[1] . 'px';

		endif;

	}

	?>

		<div class="uz_input">

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>

			<div class="image_show">
				<?php if( isset($imageShow) ) echo $imageShow; ?>
				<?php if( isset($_image_size_desc) ) echo "<p>{$_image_size_desc}</p>"; ?>
			</div>

			<input type="text" id="<?php echo $label_string; ?>" class="file" name="<?php echo $input_name; ?>" value="<?php if(isset($input_value)) echo $input_value; ?>" />

			<span class="file"> <?php _e('or','uz_terms'); ?> </span>

			<button type="button" name="browse" class="browse"> <i class="fa fa-folder-open"></i> <?php _e('Browse','uz_terms'); ?> </button>

		</div>

	<?php

}
