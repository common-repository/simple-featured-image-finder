<?php

/*************************************************
* Utilizer ui elements: slider input
**************************************************/
function uz_slider_input($label,$input_name,$input_value,$min,$max,$step=1) {

	if( !$input_value ) $input_value = $min;

	?>

	<div class="uz_input">

		<label> <?php echo $label; ?> </label>
		<input type="hidden" name="<?php echo $input_name; ?>" data-min="<?php echo $min; ?>" data-max="<?php echo $max; ?>" data-step="<?php echo $step; ?>" value="<?php echo $input_value; ?>">
		<div class="uz_slider"></div>
		<div class="uz_clear"></div>

	</div>

	<?php

}
