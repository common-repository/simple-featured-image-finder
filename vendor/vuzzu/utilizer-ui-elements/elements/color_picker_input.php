<?php

/*************************************************
* Utilizer ui elements: color picker input
**************************************************/
function uz_color_picker_input($label,$input_name,$input_value) {

	$label_string = "label_{$input_name}";

	?>

	<div class="uz_input">

		<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>

		<div class="colorpicker">

			<i class="fa fa-tint"></i>

			<a class="picker_ok" href="#"> <?php _e('Ok','uz_terms'); ?> </a>

			<input type="text" id="<?php echo $label_string; ?>" name="<?php echo $input_name; ?>" class="iris-color-picker" data-default-color="<?php if(isset($input_value)) echo $input_value; ?>" />

		</div>

	</div>

	<?php

}
