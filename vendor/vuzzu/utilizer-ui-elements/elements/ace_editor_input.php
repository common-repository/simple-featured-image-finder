<?php

/*************************************************
* Utilizer ui elements: ace editor input
**************************************************/

function uz_ace_editor_input($label,$input_name,$input_value,$mode='css') {

	$label_string = "label_{$input_name}";

	?>

	<div class="uz_input">

		<label> <?php echo $label; ?> </label>

		<div id="<?php echo $mode; ?>_container">
			<div name="<?php echo $input_name; ?>" id="<?php echo $mode; ?>_editor"></div>
		</div>

		<textarea id="<?php echo $mode; ?>_textarea" name="<?php echo $input_name; ?>" style="display: none;"><?php echo wp_kses_stripslashes($input_value); ?></textarea>

	</div>

	<?php

}
