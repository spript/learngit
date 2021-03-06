<?php
/**
 * 发现中间页（自建页面）
 * @author wuhongling
 */
class Controller_Story extends Controller_Render {

	public function action_index() {
		$webpageId = Arr::get($_GET, 'id', 0);
		$flightId = Arr::get($_GET, 'flightId', 0);
		$slotIds = (array) Kohana::$config->load('default')->get('slotIds');

		$cacheKey = "d_story_" . $webpageId;
		$data = Redisd::instance('awall')->get($cacheKey);
		if ($data !== FALSE) {
			$data = unserialize($data);
			$webpage = $data['webpage'];
			$items = $data['items'];
		} else {
			try {
				$webpage = Business::factory('Webpage')->getWebpageByWebpageId($webpageId);
				$webpageId = $webpage->getWebpageId();
				$items = Business::factory('Webpage')->getWebpageItemsByWebpageId($webpageId);

				$data = array (
					'webpage' => $webpage,
					'items' => $items,
				);
				$data = serialize($data);
				Redisd::instance('awall')->set($cacheKey, $data, 60);
			} catch (Business_Exception $e) {
				// @todo 404
				echo $e->getMessage();
				return;
			}
		}
		// echo $webpage;
		$this->_layout->content = View::factory('story/index')
			->set("webpage", $webpage)
			->set("items", $items)
			->set("slotIds", $slotIds);
	}
}
