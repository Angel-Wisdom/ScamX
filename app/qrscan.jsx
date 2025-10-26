import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";

// API services (you'll need to get free API keys for these)
const API_CONFIG = {
  VIRUS_TOTAL: '4d8ea7d37f8397c8dcc1323dc047b347c30574ed1a4da59a16f6175794a59e99', // Get from https://www.virustotal.com/
  WHOIS_API: 'at_LX4rZugwtidbqR2RHjtUJWgVEvKBM', // Get from https://whois.whoisxmlapi.com/
  IP_GEOLOCATION: '1c612b820cad41bc996a935bdd4b54f4', // Get from https://ipgeolocation.io/
  GOOGLE_SAFE_BROWSING: 'AIzaSyD94iHWU9C6UuyTXWHqTOiGRRRZC0q5FdU' // Get from https://developers.google.com/safe-browsing
};

export default function QrScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Real API calls for security analysis
  const analyzeURL = async (url) => {
    setLoading(true);
    
    try {
      const domain = extractDomain(url);
      
      // Parallel API calls for comprehensive analysis
      const [virusTotalData, whoisData, geoData, safeBrowsingData, aiAnalysis] = await Promise.all([
        checkVirusTotal(url),
        getWhoisData(domain),
        getGeoLocation(domain),
        checkGoogleSafeBrowsing(url),
        analyzeWithAI(url) // AI-based pattern analysis
      ]);

      const securityReport = {
        url: url,
        domain: domain,
        riskScore: calculateComprehensiveRiskScore(virusTotalData, safeBrowsingData, aiAnalysis),
        domainAge: whoisData.domainAge || "Unknown",
        country: geoData.country || "Unknown",
        sslStatus: await checkSSLStatus(domain),
        threatsDetected: [
          ...virusTotalData.threats,
          ...safeBrowsingData.threats,
          ...aiAnalysis.threats
        ],
        recommendations: generateRecommendations(virusTotalData, safeBrowsingData, aiAnalysis),
        analysisDetails: {
          virusTotal: virusTotalData,
          safeBrowsing: safeBrowsingData,
          aiAnalysis: aiAnalysis
        }
      };

      return securityReport;

    } catch (error) {
      console.error("Analysis error:", error);
      // Fallback to local analysis if APIs fail
      return await performLocalAnalysis(url);
    } finally {
      setLoading(false);
    }
  };

  // VirusTotal API Integration
  const checkVirusTotal = async (url) => {
    try {
      const response = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${API_CONFIG.VIRUS_TOTAL}&resource=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      return {
        positives: data.positives || 0,
        total: data.total || 0,
        threats: data.positives > 0 ? [`Detected by ${data.positives} security engines`] : [],
        scanDate: data.scan_date
      };
    } catch (error) {
      return { positives: 0, total: 0, threats: [], scanDate: null };
    }
  };

  // WHOIS API for domain information
  const getWhoisData = async (domain) => {
    try {
      const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_CONFIG.WHOIS_API}&domainName=${domain}&outputFormat=JSON`);
      const data = await response.json();
      
      const createdDate = data.WhoisRecord?.createdDate || data.WhoisRecord?.registryData?.createdDate;
      const domainAge = createdDate ? calculateDomainAge(createdDate) : "Unknown";
      
      return {
        domainAge: domainAge,
        registrar: data.WhoisRecord?.registrarName || "Unknown",
        createdDate: createdDate
      };
    } catch (error) {
      return { domainAge: "Unknown", registrar: "Unknown" };
    }
  };

  // IP Geolocation API
  const getGeoLocation = async (domain) => {
    try {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_CONFIG.IP_GEOLOCATION}&domain=${domain}`);
      const data = await response.json();
      
      return {
        country: data.country_name || "Unknown",
        isp: data.isp || "Unknown",
        organization: data.organization || "Unknown"
      };
    } catch (error) {
      return { country: "Unknown", isp: "Unknown" };
    }
  };

  // Google Safe Browsing API
  const checkGoogleSafeBrowsing = async (url) => {
    try {
      const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_CONFIG.GOOGLE_SAFE_BROWSING}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            clientId: "qr-scanner-app",
            clientVersion: "1.0.0"
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
          }
        })
      });
      
      const data = await response.json();
      const threats = data.matches ? data.matches.map(match => match.threatType) : [];
      
      return {
        isSafe: !data.matches,
        threats: threats,
        matchCount: threats.length
      };
    } catch (error) {
      return { isSafe: true, threats: [], matchCount: 0 };
    }
  };

  // AI-based pattern analysis using local heuristics + potential external AI service
  const analyzeWithAI = async (url) => {
    // This could be enhanced with a proper AI API like OpenAI, Google Perspective API, etc.
    const domain = extractDomain(url);
    
    // Advanced pattern detection
    const threats = [];
    const confidenceScores = {
      phishing: 0,
      malware: 0,
      suspicious: 0
    };

    // Check for phishing indicators
    const phishingScore = await detectPhishingPatterns(url, domain);
    if (phishingScore > 0.7) {
      threats.push("High probability of phishing");
      confidenceScores.phishing = phishingScore;
    }

    // Check for malware distribution patterns
    const malwareScore = await detectMalwarePatterns(url);
    if (malwareScore > 0.6) {
      threats.push("Potential malware distribution");
      confidenceScores.malware = malwareScore;
    }

    // Behavioral analysis
    const suspiciousScore = await analyzeBehavioralPatterns(url);
    if (suspiciousScore > 0.5) {
      threats.push("Suspicious behavioral patterns detected");
      confidenceScores.suspicious = suspiciousScore;
    }

    return {
      threats,
      confidenceScores,
      overallRisk: Math.max(phishingScore, malwareScore, suspiciousScore)
    };
  };

  // Advanced phishing detection
  const detectPhishingPatterns = async (url, domain) => {
    let score = 0;
    
    // Homograph attack detection
    const homographScore = detectHomographAttacks(domain);
    score += homographScore * 0.3;

    // Brand impersonation
    const brandImpersonationScore = detectBrandImpersonation(domain);
    score += brandImpersonationScore * 0.4;

    // URL structure analysis
    const structureScore = analyzeUrlStructure(url);
    score += structureScore * 0.3;

    return Math.min(1, score);
  };

  // Homograph attack detection
  const detectHomographAttacks = (domain) => {
    const homographPatterns = [
      { pattern: /rn/g, weight: 0.8 }, // 'rn' vs 'm'
      { pattern: /cl/g, weight: 0.7 }, // 'cl' vs 'd'
      { pattern: /[а-я]/g, weight: 0.9 }, // Cyrillic characters
      { pattern: /[0-9]/g, weight: 0.6 }, // Numbers in place of letters
      { pattern: /[o0]/g, weight: 0.5 } // Zero vs letter O
    ];

    let totalScore = 0;
    homographPatterns.forEach(({ pattern, weight }) => {
      if (pattern.test(domain)) {
        totalScore += weight;
      }
    });

    return totalScore / homographPatterns.length;
  };

  // Brand impersonation detection
  const detectBrandImpersonation = (domain) => {
    const popularBrands = [
      'google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix', 
      'paypal', 'bank', 'whatsapp', 'instagram', 'twitter'
    ];

    let score = 0;
    popularBrands.forEach(brand => {
      if (domain.includes(brand) && !isOfficialDomain(domain, brand)) {
        score += 0.3;
      }
    });

    return Math.min(1, score);
  };

  const isOfficialDomain = (domain, brand) => {
    const officialDomains = {
      'google': ['google.com', 'gmail.com', 'youtube.com'],
      'facebook': ['facebook.com', 'fb.com'],
      'amazon': ['amazon.com', 'aws.com'],
      'apple': ['apple.com', 'icloud.com']
    };

    return officialDomains[brand]?.some(official => domain.endsWith(official)) || false;
  };

  // URL structure analysis
  const analyzeUrlStructure = (url) => {
    let score = 0;
    
    // Check for excessive subdomains
    const domain = extractDomain(url);
    const subdomainCount = domain.split('.').length - 2;
    if (subdomainCount > 3) score += 0.3;

    // Check for IP address
    const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
    if (ipPattern.test(url)) score += 0.4;

    // Check for suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.xyz', '.top'];
    if (suspiciousTlds.some(tld => domain.endsWith(tld))) score += 0.3;

    return Math.min(1, score);
  };

  // Malware pattern detection
  const detectMalwarePatterns = async (url) => {
    let score = 0;
    
    // Check for executable file extensions
    const execExtensions = ['.exe', '.dmg', '.apk', '.bat', '.cmd', '.scr'];
    if (execExtensions.some(ext => url.toLowerCase().includes(ext))) {
      score += 0.6;
    }

    // Check for suspicious parameters
    const suspiciousParams = ['download', 'install', 'setup', 'cmd', 'exec'];
    if (suspiciousParams.some(param => url.toLowerCase().includes(param))) {
      score += 0.4;
    }

    return Math.min(1, score);
  };

  // Behavioral pattern analysis
  const analyzeBehavioralPatterns = async (url) => {
    let score = 0;
    
    // Check for URL length (very long URLs can be suspicious)
    if (url.length > 100) score += 0.2;

    // Check for excessive special characters
    const specialCharRatio = (url.match(/[^a-zA-Z0-9.-]/g) || []).length / url.length;
    if (specialCharRatio > 0.3) score += 0.3;

    // Check for encoding attempts
    if (url.includes('%') || url.includes('&amp;')) score += 0.2;

    return Math.min(1, score);
  };

  // Fallback local analysis when APIs fail
  const performLocalAnalysis = async (url) => {
    const domain = extractDomain(url);
    const aiAnalysis = await analyzeWithAI(url);
    
    return {
      url: url,
      domain: domain,
      riskScore: Math.floor(aiAnalysis.overallRisk * 100),
      domainAge: "Analysis unavailable",
      country: "Unknown",
      sslStatus: "Unknown",
      threatsDetected: aiAnalysis.threats,
      recommendations: aiAnalysis.threats.length > 0 ? 
        ["Use extreme caution - limited analysis available"] : 
        ["Basic analysis shows no obvious threats"]
    };
  };

  // Calculate comprehensive risk score
  const calculateComprehensiveRiskScore = (virusTotalData, safeBrowsingData, aiAnalysis) => {
    let score = 0;
    
    // VirusTotal weight: 40%
    if (virusTotalData.positives > 0) {
      score += (virusTotalData.positives / virusTotalData.total) * 40;
    }
    
    // Safe Browsing weight: 30%
    if (!safeBrowsingData.isSafe) {
      score += 30;
    }
    
    // AI Analysis weight: 30%
    score += aiAnalysis.overallRisk * 30;
    
    return Math.min(100, Math.max(0, score));
  };

  // Generate recommendations based on analysis
  const generateRecommendations = (virusTotalData, safeBrowsingData, aiAnalysis) => {
    const recommendations = [];
    
    if (virusTotalData.positives > 0) {
      recommendations.push(`Blocked by ${virusTotalData.positives} security engines - Avoid this site`);
    }
    
    if (!safeBrowsingData.isSafe) {
      recommendations.push("Google Safe Browsing detected threats - Do not proceed");
    }
    
    if (aiAnalysis.confidenceScores.phishing > 0.7) {
      recommendations.push("High probability of phishing - Do not enter any personal information");
    }
    
    if (aiAnalysis.confidenceScores.malware > 0.6) {
      recommendations.push("Potential malware source - Do not download anything");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("No obvious threats detected - Proceed with normal caution");
    }
    
    return recommendations;
  };

  // Helper functions
  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return "Invalid URL";
    }
  };

  const calculateDomainAge = (createdDate) => {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  const checkSSLStatus = async (domain) => {
    try {
      const response = await fetch(`https://${domain}`, { method: 'HEAD' });
      return response.ok ? "Valid" : "Invalid";
    } catch {
      return "Unknown";
    }
  };

  const handleScan = async (scanningResult) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    const data = scanningResult.data;

    try {
      // Validate if it's a URL
      new URL(data);
      const securityReport = await analyzeURL(data);
      setScanData(securityReport);
      
      if (securityReport.riskScore >= 70) {
        setResult("🚨 High Risk URL Detected");
      } else if (securityReport.riskScore >= 40) {
        setResult("⚠️ Medium Risk URL");
      } else {
        setResult("✅ Safe URL");
      }
    } catch {
      // Not a URL - analyze text content
      const textAnalysis = await analyzeTextContent(data);
      setScanData(textAnalysis);
      setResult(textAnalysis.riskScore >= 70 ? "🚨 Suspicious Content" : "ℹ️ Text Content");
    }
  };

  const analyzeTextContent = async (text) => {
    const lowerText = text.toLowerCase();
    const threats = [];
    let riskScore = 10;

    // Check for malicious patterns in text
    const maliciousPatterns = [
      { pattern: /fraud|scam|phishing|malicious|virus|trojan/i, score: 80 },
      { pattern: /password|login|credential|banking|account/i, score: 60 },
      { pattern: /bitcoin|crypto|wallet|investment|profit/i, score: 50 },
      { pattern: /free|gift|prize|winner|lottery/i, score: 40 }
    ];

    maliciousPatterns.forEach(({ pattern, score }) => {
      if (pattern.test(text)) {
        threats.push(`Suspicious keywords: "${pattern.toString()}"`);
        riskScore = Math.max(riskScore, score);
      }
    });

    return {
      content: text,
      riskScore: riskScore,
      threatsDetected: threats,
      recommendations: threats.length > 0 ? 
        ["Be cautious with this content"] : 
        ["Content appears to be safe text"]
    };
  };

  const resetScanner = () => {
    setScanned(false);
    setResult(null);
    setScanData(null);
    setLoading(false);
  };

  // Rest of the component rendering remains similar to previous version
  // ... (UI code from previous implementation)

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Running Security Analysis...</Text>
          <Text style={styles.loadingSubtext}>Checking VirusTotal, Safe Browsing, and AI Analysis</Text>
        </View>
      )}

      {scanned && scanData && (
        <View style={styles.reportOverlay}>
          <ScrollView style={styles.reportContainer}>
            <Text style={styles.reportTitle}>Security Report</Text>
            
            <View style={[
              styles.riskScore, 
              { backgroundColor: scanData.riskScore >= 70 ? '#ff4444' : scanData.riskScore >= 40 ? '#ffaa00' : '#00c851' }
            ]}>
              <Text style={styles.riskScoreText}>Risk Score</Text>
              <Text style={styles.riskScoreNumber}>{scanData.riskScore}/100</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scanned Content</Text>
              <Text style={styles.urlText}>{scanData.url || scanData.content}</Text>
            </View>

            {scanData.domain && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Domain Information</Text>
                <Text>Domain: {scanData.domain}</Text>
                <Text>Domain Age: {scanData.domainAge}</Text>
                <Text>Country: {scanData.country}</Text>
                <Text>SSL Status: {scanData.sslStatus}</Text>
              </View>
            )}

            {scanData.threatsDetected && scanData.threatsDetected.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Threats Detected</Text>
                {scanData.threatsDetected.map((threat, index) => (
                  <Text key={index} style={styles.threatText}>• {threat}</Text>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {scanData.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationText}>• {rec}</Text>
              ))}
            </View>

            {scanData.analysisDetails && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Analysis Sources</Text>
                <Text>• VirusTotal: {scanData.analysisDetails.virusTotal.positives > 0 ? 'Threats detected' : 'Clean'}</Text>
                <Text>• Google Safe Browsing: {scanData.analysisDetails.safeBrowsing.isSafe ? 'Safe' : 'Unsafe'}</Text>
                <Text>• AI Analysis: {scanData.analysisDetails.aiAnalysis.overallRisk > 0.5 ? 'Suspicious' : 'Normal'}</Text>
              </View>
            )}

            <View style={styles.actions}>
              <Button title="Scan Another" onPress={resetScanner} />
              <View style={styles.spacer} />
              <Button 
                title="View Detailed Report" 
                onPress={() => Alert.alert(
                  "Detailed Analysis", 
                  `VirusTotal: ${scanData.analysisDetails?.virusTotal.positives || 0} engines detected threats\nSafe Browsing: ${scanData.analysisDetails?.safeBrowsing.isSafe ? 'Safe' : 'Unsafe'}\nAI Confidence: ${Math.round((scanData.analysisDetails?.aiAnalysis.overallRisk || 0) * 100)}%`
                )}
                color="#007AFF"
              />
            </View>
          </ScrollView>
        </View>
      )}

      {scanned && !scanData && (
        <View style={styles.overlay}>
          <Text style={styles.result}>{result}</Text>
          <Button title="Scan Again" onPress={resetScanner} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingSubtext: {
    color: "white",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  reportOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  riskScore: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  riskScoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  riskScoreNumber: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  urlText: {
    color: "#007AFF",
    fontSize: 14,
  },
  threatText: {
    color: "#dc3545",
    fontSize: 14,
    marginBottom: 4,
  },
  recommendationText: {
    color: "#28a745",
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
  spacer: {
    height: 12,
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
});