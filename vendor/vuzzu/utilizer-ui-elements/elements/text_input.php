<?php

/*************************************************
* Utilizer ui elements: text input
**************************************************/
function uz_text_input($label,$input_name,$input_value,$validation=null) {

	$label_string = "label_{$input_name}";

	?>

		<div class="uz_input">

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>
			<input type="text" id="<?php echo $label_string; ?>" name="<?php echo $input_name; ?>"
				   class="<?php echo $validation; ?>" value="<?php if(isset($input_value)) echo $input_value; ?>" />

		</div>

	<?php

}
