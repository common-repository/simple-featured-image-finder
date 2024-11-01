<?php

/*************************************************
* Utilizer ui elements: date pcker input
**************************************************/
function uz_date_picker_input($label,$input_name,$input_value) {

	$label_string = "label_{$input_name}";

	?>

		<div class="uz_input">

			<label for="<?php echo $label_string; ?>"> <?php echo $label; ?> </label>

			<div class="datepicker">

				<i class="fa fa-calendar"></i>

				<input type="text" id="<?php echo $label_string; ?>" name="<?php echo $input_name; ?>" class="datepicker" value="<?php if(isset($input_value)) echo $input_value; ?>" />

			</div>

		</div>

	<?php

}
