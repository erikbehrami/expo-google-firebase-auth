import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../firebase";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);
    };

    const handleRegister = async () => {
        if (!email || !password) {
            return showMessage("Plotëso emailin dhe fjalëkalimin.", "error");
        }

        if (password.length < 6) {
            return showMessage("Fjalëkalimi duhet të jetë së paku 6 karaktere.", "error");
        }

        setLoading(true);
        setMessage("");
        try {
            console.log("Attempting registration with:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Registration successful:", userCredential.user.email);
            showMessage("Llogaria u krijua me sukses!", "success");
            setTimeout(() => {
                router.replace("/");
            }, 1500);
        } catch (error) {
            console.error("Register Error:", error);
            let errorMessage = "Gabim në regjistrim. Provo përsëri.";

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Ky email është tashmë në përdorim.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Email i pavlefshëm.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Fjalëkalimi është shumë i dobët.";
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = "Regjistrimi me email nuk është i aktivizuar.";
            }

            showMessage(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Duke krijuar llogarinë...</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Krijo Llogari</Text>
                <Text style={styles.subtitle}>Regjistrohu për të filluar</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Fjalëkalimi (min 6 karaktere)"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {message ? (
                    <View style={[
                        styles.messageContainer,
                        messageType === "success" ? styles.successMessage : styles.errorMessage
                    ]}>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Regjistrohu</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Ke tashmë llogari? </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text style={styles.footerLink}>Kyçu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA"
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B7280"
    },
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 24,
        paddingTop: 80
    },
    header: {
        alignItems: "center",
        marginBottom: 50
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280"
    },
    form: {
        width: "100%"
    },
    input: {
        width: "100%",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        color: "#1F2937"
    },
    messageContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
    },
    successMessage: {
        backgroundColor: '#DCFCE7',
        borderColor: '#22C55E',
    },
    errorMessage: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
    },
    messageText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: "#FF6B35",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#FF6B35",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: "#9CA3AF",
        shadowColor: "#9CA3AF",
    },
    primaryButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    footerText: {
        color: "#6B7280",
        fontSize: 15
    },
    footerLink: {
        color: "#2563EB",
        fontSize: 15,
        fontWeight: "600"
    },
});