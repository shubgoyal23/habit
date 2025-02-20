package helpers

var BaseUrl string
var ImageUrl string
var ImageUrlDaily string

func InitImageHandler() {
	BaseUrl = "https://res.cloudinary.com/dkznkabup/image/upload/f_auto,q_auto/v1/habit-tracker/"
	if res, err := RedisLMove("habitNotifyImg"); err == nil {
		ImageUrl = BaseUrl + res
	}
	if res, err := RedisLMove("habitNotifyImg_Daily"); err == nil {
		ImageUrlDaily = BaseUrl + res
	}
}

func ChangeImage() {
	if res, err := RedisLMove("habitNotifyImg"); err == nil {
		ImageUrl = BaseUrl + res
	}
}
func ChangeImageDaily() {
	if res, err := RedisLMove("ImageUrlDaily"); err == nil {
		ImageUrlDaily = BaseUrl + res
	}
}
