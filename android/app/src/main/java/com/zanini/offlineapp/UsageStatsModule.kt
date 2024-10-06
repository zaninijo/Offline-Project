package com.zanini.offlineapp
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context


class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "UsageStatsModule"
    }

    @ReactMethod
    fun getUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime.toLong(), endTime.toLong())

        // Convert List<UsageStats> to WritableArray
        val writableArray: WritableArray = Arguments.createArray()
        for (usageStats in usageStatsList) {
            val map: WritableMap = Arguments.createMap()
            map.putString("packageName", usageStats.packageName)
            map.putDouble("totalTime", usageStats.totalTimeInForeground.toDouble())
            map.putDouble("timeStart", usageStats.lastTimeUsed.toDouble() - usageStats.totalTimeInForeground.toDouble())
            map.putDouble("timeEnd", usageStats.lastTimeUsed.toDouble())
            writableArray.pushMap(map)
        }

        // Resolve the promise with the WritableArray
        promise.resolve(writableArray)
    }
}
