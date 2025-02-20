package helpers

import (
	"encoding/json"
	"fmt"
	"io"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Logger *zap.Logger

type WriteFunc func([]byte) (int, error)
type Logtype string

const (
	Local  Logtype = "local"
	Remote Logtype = "Remote"
)

type LoggerStruct struct {
	Level      string `json:"level" binding:"required"`
	Eventstamp string `json:"ts" binding:"required"`
	Caller     string `json:"caller" binding:"required"`
	Errorcode  string `json:"msg" binding:"required"`
	Message    string `jsong:"message" binding:"required"`
	Action     string `json:"sendto" binding:"required"`
	Source     string `json:"source" binding:"required"`
}

func (fn WriteFunc) Write(data []byte) (int, error) {
	return fn(data)
}

func Writelocallog(l string) {
	l = fmt.Sprintf("%s\n", l)
	local_log_handle, ferr := os.OpenFile("arch_local.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if ferr != nil {
		fmt.Printf("Unable to open arch_local.log because %s", ferr.Error())
	}
	defer local_log_handle.Close()
	if _, err := local_log_handle.WriteString(l); err != nil {
		// write to remote that local log failed
		fmt.Printf("Error writing to local log %s", err.Error())
	} else {
		local_log_handle.Sync()
	}
}

//push logs to list

func NewLogrusWrite() io.Writer {
	return WriteFunc(func(data []byte) (int, error) {
		var e LoggerStruct
		err := json.Unmarshal(data, &e)
		if err != nil {
			Writelocallog(fmt.Sprintf("Logmanager:NewLogrusWrite: unable to unmarshal log writer payload %s, because %s ", data, err.Error()))
		} else {
			if e.Action == string(Local) {
				Writelocallog(fmt.Sprintf("Level: %s, Eventstamp:%s, Caller:%s, ErrorCode:%s, Message:%s", e.Level, e.Eventstamp, e.Caller, e.Errorcode, e.Message))
			} else if e.Action == string(Remote) {
				je, jerr := json.Marshal(e)
				if jerr != nil {
					Writelocallog(fmt.Sprintf("Marshalhelper failed,log below\n, Level: %s, Eventstamp:%s, Caller:%s, ErrorCode:%s, Message:%s\n", e.Level, e.Eventstamp, e.Caller, e.Errorcode, e.Message))
				} else {
					var tl []interface{} = make([]interface{}, 0)
					tl = append(tl, je)
					if lf := ListLpush("applog", tl); !lf {
						Writelocallog(fmt.Sprintf("Lpush to applog failed,log below\n, Level: %s, Eventstamp:%s, Caller:%s, ErrorCode:%s, Message:%s\n", e.Level, e.Eventstamp, e.Caller, e.Errorcode, e.Message))
					}
				}
			}
		}
		return 0, nil
	})
}

func getEncoder() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	return zapcore.NewJSONEncoder(encoderConfig)
}

func getLogWriter() zapcore.WriteSyncer {
	return zapcore.AddSync(NewLogrusWrite())
}

func InitLogger() *zap.Logger {
	writerSyncer := getLogWriter()
	encoder := getEncoder()
	core := zapcore.NewCore(encoder, writerSyncer, zapcore.DebugLevel)
	logger := zap.New(core, zap.AddCaller())
	Logger = logger
	return logger
}
