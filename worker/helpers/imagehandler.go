package helpers

var BaseUrl string
var ImageUrl string

// "https://res.cloudinary.com/dkznkabup/image/upload/v1736139148/habit-tracker/qxo56br4qdlaiuittpco.webp"

func InitImageHandler() {
	BaseUrl = "https://res.cloudinary.com/dkznkabup/image/upload/f_auto,q_auto/v1/habit-tracker/"
	if res, err := RedisLMove("habitNotifyImg"); err == nil {
		ImageUrl = BaseUrl + res
	}
}

func ChangeImage() {
	if res, err := RedisLMove("habitNotifyImg"); err == nil {
		ImageUrl = BaseUrl + res
	}
}
