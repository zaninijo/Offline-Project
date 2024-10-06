package com.zanini.offlineapp

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import java.io.ByteArrayOutputStream
import android.graphics.Bitmap

class InstalledAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledApps"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm: PackageManager = reactApplicationContext.packageManager
            val apps: List<ApplicationInfo> = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val appList: WritableArray = Arguments.createArray()

            for (app in apps) {
                val appInfo: WritableMap = Arguments.createMap()
                appInfo.putString("appName", app.loadLabel(pm).toString())
                appInfo.putString("packageName", app.packageName)

                // Tentativa de converter o ícone para uma string Base64
                val iconDrawable: Drawable? = app.loadIcon(pm)
                if (iconDrawable is BitmapDrawable) {
                    // Se for um BitmapDrawable, converte para Base64
                    val bitmap: Bitmap = iconDrawable.bitmap
                    val outputStream = ByteArrayOutputStream()
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
                    val iconBytes: ByteArray = outputStream.toByteArray()
                    val iconBase64 = Base64.encodeToString(iconBytes, Base64.DEFAULT)
                    appInfo.putString("icon", iconBase64)
                } else if (iconDrawable != null) {
                    // Para outros tipos de Drawable, tenta convertê-los para Bitmap
                    try {
                        val bitmap = Bitmap.createBitmap(
                            iconDrawable.intrinsicWidth,
                            iconDrawable.intrinsicHeight,
                            Bitmap.Config.ARGB_8888
                        )
                        val canvas = android.graphics.Canvas(bitmap)
                        iconDrawable.setBounds(0, 0, canvas.width, canvas.height)
                        iconDrawable.draw(canvas)

                        val outputStream = ByteArrayOutputStream()
                        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
                        val iconBytes: ByteArray = outputStream.toByteArray()
                        val iconBase64 = Base64.encodeToString(iconBytes, Base64.DEFAULT)
                        appInfo.putString("icon", iconBase64)
                    } catch (e: Exception) {
                        // Em caso de falha, define um ícone padrão
                        appInfo.putString("icon", "")
                    }
                } else {
                    // Se o ícone não estiver disponível, retorna uma string vazia
                    appInfo.putString("icon", "")
                }

                appList.pushMap(appInfo)
            }

            promise.resolve(appList)
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }
}
