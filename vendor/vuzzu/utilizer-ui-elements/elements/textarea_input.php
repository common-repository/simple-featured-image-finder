<?php

/*************************************************
* Utilizer admin ui elements
**************************************************/
function uz_textarea_input($label,$input_name,$input_value) {

	$label_string = "label_{$input_name}";

	?>

		<div class="uz_input">

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>

			<textarea id="<?php echo $label_string; ?>" name="<?php echo $input_name; ?>"><?php if(isset($input_value)) echo $input_value; ?></textarea>

		</div>

	<?php

}
