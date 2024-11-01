<?php

/*************************************************
* Utilizer ui elements: font awesome input
**************************************************/
function uz_font_awesome_input($label,$input_name,$input_value) {

	?>

		<div class="uz_input">

			<label> <?php echo $label; ?> </label>

			<div class="search-icons">
				<input type="text" placeholder="<?php _e('search icon...','uz_terms'); ?>" class="search-icon uz_skip" />
			</div>

			<div class="fa-icons" data-actual="<?php if(isset($input_value)) echo $input_value; ?>">

				<div class="inner">
					<input type="hidden" name="<?php echo $input_name; ?>" value="<?php if(isset($input_value)) echo $input_value; ?>" />
				</div>

				<div class="arrows">
					<a href="#" data-go="prev"> <i class="fa fa-angle-up fa-2x"></i> </a>
					<a href="#" data-go="next"> <i class="fa fa-angle-down fa-2x"></i> </a>
				</div>

			</div>

		</div>

	<?php

}
