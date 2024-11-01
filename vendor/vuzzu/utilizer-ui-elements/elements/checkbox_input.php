<?php

/*************************************************
* Utilizer ui elements: checkbox input
**************************************************/

// Checkbox ui element
function uz_checkbox_input($label,$input_name,$input_value) {

	if( $input_value ) { $state = 1; }

	?>

		<div class="uz_input">

			<label> <?php echo $label; ?> </label>
			<div class="uz_clear"></div>
			<a href="#" class="checkbox" data-actual="<?php if(isset($state)) echo $state; ?>">
				<div class="inner">
					<p class="off"> Off </p>
					<i class="fa fa-times-circle-o off"></i>
					<i class="fa fa-check-circle-o on"></i>
					<p class="on"> On </p>
				</div>
				<input type="checkbox" name="<?php echo $input_name; ?>" value="<?php if(isset($state)) echo $state; ?>" checked="checked" />
			</a>

			<div class="uz_clear"></div>

		</div>

	<?php

}
