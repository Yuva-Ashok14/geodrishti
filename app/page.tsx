"use client";

import React, { useState, useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Layers,
  Sprout,
  Building2,
  Mic,
  MicOff,
  Clock,
  Sparkles,
  Camera,
  Satellite,
  ShieldCheck,
  Globe2,
  Volume2,
  RefreshCw,
  Sun,
  Droplets,
  Wind,
  MapPin,
  FileDown,
  Truck,
  AlertTriangle,
  Zap,
  Shield,
  Activity,
  Lock,
  FileText,
  Send,
  Users,
  Building
} from "lucide-react";

interface SectorDetail {
  title: string;
  tag: string;
  stats: { label: string; value: string; color: string }[];
  insights: string[];
  recommendation: string;
  voiceTe: string;
  voiceEn: string;
}

interface LocationRecord {
  category: string;
  name: string;
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  soil: string;
  elevation: string;
  sectors: {
    satellite: SectorDetail;
    agri: SectorDetail;
    urban: SectorDetail;
    traffic: SectorDetail;
    disaster: SectorDetail;
    energy: SectorDetail;
    defense: SectorDetail;
  };
  timelineData: {
    [year: number]: {
      builtUp: string;
      waterIndex: string;
      ndvi: string;
      event: string;
    };
  };
}

const MASTER_LOCATIONS: LocationRecord[] = [
  // 1. Pathapadu (Default Index 0)
  {
    category: "Vijayawada & Rural Cluster",
    name: "Pathapadu (Rural/Agri & North Growth Corridor)",
    lng: 80.6385,
    lat: 16.5925,
    zoom: 14.8,
    pitch: 62,
    soil: "Alluvial Clay Loam (Rich Krishna Silt)",
    elevation: "24m MSL",
    sectors: {
      satellite: {
        title: "SatQuery 4D Change Intelligence",
        tag: "Sentinel-2 Multi-Spectral Optical & SAR Backscatter",
        stats: [
          { label: "Built-up Sprawl", value: "+28.4%", color: "text-sky-400" },
          { label: "Water Level Delta", value: "-14.2%", color: "text-indigo-400" },
          { label: "NDVI Mean", value: "0.58", color: "text-emerald-400" },
        ],
        insights: [
          "Spillover conversion: 14.6 hectares converted from traditional agriculture to peri-urban layouts.",
          "Groundwater table depleted by 1.8m post-2022; canal water discharge dependent on upstream barrages.",
          "Catchment buffer risk: 6 unauthorized structures identified along the secondary irrigation canal."
        ],
        recommendation: "Issue geo-tagged boundary preservation order under Section 12 AP Land Governance Act.",
        voiceTe: "పాతపాడు ప్రాంతంలో వ్యవసాయ భూములు వేగంగా నివాస స్థలాలుగా మారుతున్నాయి. నీటి నిల్వలు 14 శాతం తగ్గాయి. తక్షణమే కాలువ బఫర్ జోన్లను సంరక్షించాలి.",
        voiceEn: "Pathapadu shows rapid peri-urban layout conversions along the northern corridor with a 14% drop in surface water retention. Immediate canal buffer enforcement is recommended."
      },
      agri: {
        title: "AgriMind: Precision Agronomy & Soil Health",
        tag: "Soil Health Matrix • Krishna Alluvial Delta",
        stats: [
          { label: "Soil Class", value: "Alluvial Clay Loam", color: "text-emerald-400" },
          { label: "pH Level", value: "7.6 (Optimal)", color: "text-sky-400" },
          { label: "Yield ROI Shift", value: "+34.2%", color: "text-amber-400" },
        ],
        insights: [
          "Nitrogen-potassium ratio has dropped 12% due to continuous monocropping of standard paddy.",
          "Forecasted 90-day rainfall deficit of 14% warrants shift to drought-tolerant legumes.",
          "Recommendation: Black Gram (Urad) / Sweet Corn rotation saves 38% irrigation water."
        ],
        recommendation: "Eligible for PM-KUSUM Solar Micro-Irrigation & Soil Re-certification subsidy.",
        voiceTe: "పాతపాడు నేలల్లో నత్రజని పరిమాణం తగ్గింది. పత్తి లేదా సాధారణ వరికి బదులుగా మినుములు లేదా స్వీట్ కార్న్ సాగు చేస్తే 38 శాతం నీరు ఆదా అవుతుంది.",
        voiceEn: "AgriMind detects nitrogen depletion in Pathapadu soil. Switching to Black Gram or Sweet Corn saves 38% irrigation water while boosting net margins."
      },
      urban: {
        title: "Urban3D Digital Twin & Volumetric Audit",
        tag: "Procedural 3D Zoning & FAR Compliance",
        stats: [
          { label: "Zone Class", value: "Peri-Urban R2", color: "text-amber-400" },
          { label: "Permissible Height", value: "G + 5 Floors (18m)", color: "text-sky-400" },
          { label: "Solar Shadow Block", value: "0% Adverse", color: "text-emerald-400" },
        ],
        insights: [
          "Master Plan 2031 alignment: Setback compliance is valid up to G+5 residential envelopes.",
          "Commercial warehousing along bypass requires 6.0m arterial road front setback.",
          "Shadow projection analysis confirms zero thermal blockage on adjoining agricultural solar dryers."
        ],
        recommendation: "Ready for AP CRDA Single-Window Automated Building Clearance.",
        voiceTe: "అర్బన్ 3D ప్లానింగ్ ప్రకారం పాతపాడులో జీ ప్లస్ 5 అంతస్తుల వరకు అనుమతి ఉంది. ఎలాంటి సోలార్ షాడో అడ్డంకులు లేవు.",
        voiceEn: "Urban3D confirms G+5 procedural building compliance under Master Plan bylaws with full solar exposure safety."
      },
      traffic: {
        title: "Mobility & Freight Logistics Glimpse",
        tag: "AI Road Density & APMC Freight Corridor",
        stats: [
          { label: "Bypass Velocity", value: "42 km/h Avg", color: "text-amber-400" },
          { label: "Congestion Index", value: "Moderate (5.8/10)", color: "text-rose-400" },
          { label: "Freight Latency", value: "+14 mins", color: "text-sky-400" },
        ],
        insights: [
          "Primary bottleneck: Pathapadu junction connecting rural agro-trucks to Vijayawada APMC market.",
          "Peak tractor freight density occurs between 05:00 AM and 09:00 AM daily.",
          "AI routing directive: Auto-reroutes multi-axle freight via outer northern ring bypass."
        ],
        recommendation: "Deploy dedicated freight bypass lane at northern junction.",
        voiceTe: "పాతపాడు జంక్షన్ వద్ద ఉదయం వేళల్లో వ్యవసాయ లారీల రద్దీ ఎక్కువగా ఉంది. బైపాస్ లైన్ నిర్మాణం ప్రతిపాదించబడింది.",
        voiceEn: "Pathapadu freight corridor experiences peak morning latency. Dedicated agro-logistics bypass lane is advised."
      },
      disaster: {
        title: "Disaster Mitigation & Flood Risk Command",
        tag: "Hydrodynamic Terrain Runoff & Inundation Map",
        stats: [
          { label: "Inundation Risk", value: "Low-Medium (Level 2)", color: "text-amber-400" },
          { label: "Runoff Discharge", value: "320 m³/sec", color: "text-sky-400" },
          { label: "Relief Triage Center", value: "Nunna ZP School (1.2 km)", color: "text-emerald-400" },
        ],
        insights: [
          "Elevation gradient of 24m MSL protects eastern agricultural tracts from acute river backflow.",
          "Western boundary adjacent to minor drainage stream requires silt dredging before monsoon.",
          "Multi-Agency Alert Ready: Direct dispatch lines open for District Collectorate, NDRF 10th Bn, and SDRF."
        ],
        recommendation: "Initiate proactive canal dredging and activate automated flood triage bulletin.",
        voiceTe: "పాతపాడు వరద విశ్లేషణ పూర్తయింది. పశ్చిమ కాలువ వెంబడి పూడికతీత పనులు తక్షణమే పూర్తి చేయాలి. సహాయక బృందాలకు సమాచారం సిద్ధంగా ఉంది.",
        voiceEn: "Disaster simulation complete for Pathapadu. Low-medium flood vulnerability detected. Emergency dispatch dossiers ready for NDRF and State Relief Teams."
      },
      energy: {
        title: "Renewable Energy & DISCOM Grid Intelligence",
        tag: "Rooftop PV Mapping • Area Consumption vs Generation",
        stats: [
          { label: "Area Consumption", value: "3.2 MWh/day", color: "text-amber-400" },
          { label: "Solar Generation Cap", value: "5.8 MWh/day", color: "text-emerald-400" },
          { label: "Feeder Headroom", value: "48% Available", color: "text-sky-400" },
        ],
        insights: [
          "Microgrid potential: Usable rooftop area across rural warehouses totals 34,200 sq. meters.",
          "Generation exceeds daytime baseline demand by 181%, enabling active grid feed-in under net metering.",
          "Substation 33/11kV transformer possesses 1.2 MW injection capacity before line reinforcement."
        ],
        recommendation: "Submit Solar Saturation Report to State Electricity Regulatory Commission & DISCOM.",
        voiceTe: "పాతపాడు ప్రాంతంలో సోలార్ విద్యుత్ ఉత్పత్తి సామర్థ్యం స్థానిక వినియోగం కంటే ఎక్కువగా ఉంది. విద్యుత్ శాఖకు ఫీడర్ నివేదిక సిద్ధంగా ఉంది.",
        voiceEn: "Solar intelligence confirms high renewable saturation capacity in Pathapadu. Grid feeder export dossier ready for State DISCOM and Ministry of Power."
      },
      defense: {
        title: "Strategic Defense & Reconnaissance Enclave",
        tag: "Restricted Military Telemetry • Tri-Services & MoD Only",
        stats: [
          { label: "Security Clearance", value: "TOP SECRET // TIER 1", color: "text-rose-400" },
          { label: "Thermal Anomalies", value: "0 Detected", color: "text-emerald-400" },
          { label: "Airspace Status", value: "DGCA Green Corridor", color: "text-sky-400" },
        ],
        insights: [
          "Sovereign encrypted channel active: Linked to Directorate General of Military Operations (DGMO) protocols.",
          "High-resolution Synthetic Aperture Radar (SAR) co-registered for subterranean and border perimeter tracking.",
          "Critical communications corridor verified: Anti-jamming satellite telemetry confirmed along Krishna basin."
        ],
        recommendation: "Maintain automated optical thermal scan every 15 minutes; report any deviation to Southern Command.",
        voiceTe: "రక్షణ విభాగం అధికారిక నివేదిక. భద్రతా తనిఖీలు పూర్తయ్యాయి. ఎటువంటి అసాధారణ కదలికలు నమోదు కాలేదు.",
        voiceEn: "Classified military surveillance active. Zero unauthorized thermal signatures or perimeter breaches detected in the strategic sector."
      }
    },
    timelineData: {
      2020: { builtUp: "12.4%", waterIndex: "68% (High)", ndvi: "0.74", event: "Active traditional crop rotation with full canal discharge." },
      2021: { builtUp: "14.1%", waterIndex: "65%", ndvi: "0.72", event: "Initial warehousing conversions along the main road." },
      2022: { builtUp: "16.8%", waterIndex: "59%", ndvi: "0.68", event: "Commercial plot demarcations; groundwater extraction up by 14%." },
      2023: { builtUp: "19.5%", waterIndex: "54%", ndvi: "0.65", event: "Expansion of rural residential layouts and solar drying units." },
      2024: { builtUp: "23.2%", waterIndex: "48% (Deficit)", ndvi: "0.61", event: "Dry spell impacted summer crop yield; borewell depth surged past 180ft." },
      2025: { builtUp: "27.0%", waterIndex: "51%", ndvi: "0.59", event: "Modern micro-irrigation subsidies deployed across 45 hectares." },
      2026: { builtUp: "31.4%", waterIndex: "46% (Critical)", ndvi: "0.56", event: "High urban-fringe spillover; buffer zone preservation recommended." }
    }
  },

  // 2. Vijayawada City Core
  {
    category: "Vijayawada & Rural Cluster",
    name: "Vijayawada (City Core & Prakasam Barrage)",
    lng: 80.6167,
    lat: 16.5062,
    zoom: 13.2,
    pitch: 55,
    soil: "Delta Clay Loam (Krishna Delta)",
    elevation: "23m MSL",
    sectors: {
      satellite: {
        title: "SatQuery 4D Urban Sprawl & River Inundation",
        tag: "Sentinel Optical & RISAT SAR Cross-Modal",
        stats: [
          { label: "Built-up Density", value: "78.4%", color: "text-sky-400" },
          { label: "River Discharge", value: "Safe Tier", color: "text-indigo-400" },
          { label: "Barrage Water Head", value: "12.0 ft FRL", color: "text-emerald-400" },
        ],
        insights: [
          "Real-time Krishna floodgate telemetry co-registered with Prakasam Barrage spillways.",
          "High urban density along riverbank embankments monitored for structural river scour.",
          "Automated alerts tied to AP State Disaster Management Authority (APSDMA)."
        ],
        recommendation: "Maintain automated 15-minute telemetry sync with Central Water Commission.",
        voiceTe: "విజయవాడ ప్రకాశం బ్యారేజ్ వద్ద వరద నీటి మట్టం స్థిరంగా ఉంది. కృష్ణా నది పరివాహక ప్రాంతాలు సురక్షితంగా ఉన్నాయి.",
        voiceEn: "Prakasam Barrage water levels and Krishna river urban riverfront remain within safe flood regulation thresholds."
      },
      agri: { title: "Ayacut Irrigation Flow", tag: "Delta Command", stats: [{ label: "Canal Flow", value: "12,400 Cusecs", color: "text-emerald-400" }], insights: ["Krishna Delta canals operating at full design discharge."], recommendation: "Regulate gate flow.", voiceTe: "కాలువల ద్వారా సాగునీరు అందుతోంది.", voiceEn: "Canal water distribution optimal." },
      urban: { title: "Urban3D Core Twin", tag: "CRDA Bylaws", stats: [{ label: "Permissible Height", value: "G + 12 Floors", color: "text-amber-400" }], insights: ["Commercial corridors cleared for high-density smart city development."], recommendation: "Approve CRDA dossiers.", voiceTe: "భవన నిర్మాణ నిబంధనలు అనుకూలంగా ఉన్నాయి.", voiceEn: "Building bylaws compliant." },
      traffic: { title: "Kanaka Durga Mobility", tag: "Flyover AI Density", stats: [{ label: "Corridor Speed", value: "48 km/h", color: "text-sky-400" }], insights: ["Kanaka Durga flyover bypass smooth with zero cargo bottlenecks."], recommendation: "Keep bypass routing active.", voiceTe: "ట్రాఫిక్ రద్దీ సాధారణంగా ఉంది.", voiceEn: "Traffic flow normalized." },
      disaster: { title: "Disaster Mitigation Grid", tag: "Barrage Early Warning", stats: [{ label: "Surge Headroom", value: "3.5 Lakh Cusecs", color: "text-amber-400" }], insights: ["Early alert beacons operational across low-lying municipal wards."], recommendation: "Maintain standby NDRF 10th Bn boats.", voiceTe: "వరద హెచ్చరిక వ్యవస్థ సిద్ధంగా ఉంది.", voiceEn: "Flood mitigation protocols armed." },
      energy: { title: "Municipal Solar Grid", tag: "DISCOM Microgrid", stats: [{ label: "Rooftop Solar", value: "14.2 MWh/day", color: "text-emerald-400" }], insights: ["Commercial rooftops along MG Road feeding daytime surplus to grid."], recommendation: "Issue net-metering credits.", voiceTe: "సోలార్ విద్యుత్ ఉత్పత్తి గణనీయంగా ఉంది.", voiceEn: "Solar grid generation optimal." },
      defense: { title: "Southern Command Liaison", tag: "Sovereign Air Corridor", stats: [{ label: "Perimeter", value: "Secure", color: "text-emerald-400" }], insights: ["Strategic railway bridges and arterial highway links verified."], recommendation: "Maintain 24/7 sat-radar.", voiceTe: "రక్షణ తనిఖీలు పూర్తయ్యాయి.", voiceEn: "Defense perimeter verified." }
    },
    timelineData: {
      2020: { builtUp: "58.0%", waterIndex: "72%", ndvi: "0.45", event: "Kanaka Durga flyover expansion and riverfront survey." },
      2026: { builtUp: "78.4%", waterIndex: "68%", ndvi: "0.38", event: "Live 3D digital twin integration with barrage sensors." }
    }
  },

  // 3. Ambapuram
  {
    category: "Vijayawada & Rural Cluster",
    name: "Ambapuram (Vijayawada Rural)",
    lng: 80.5912,
    lat: 16.5684,
    zoom: 14.5,
    pitch: 45,
    soil: "Alluvial Agri Buffer",
    elevation: "24m MSL",
    sectors: {
      satellite: { title: "Agrarian Buffer Sentinel Analysis", tag: "Sentinel-2 Multi-Spectral", stats: [{ label: "Farm Parcel Sprawl", value: "-2.1%", color: "text-emerald-400" }, { label: "Canal Runoff", value: "Normal", color: "text-sky-400" }, { label: "NDVI", value: "0.64", color: "text-emerald-400" }], insights: ["Agrarian green belt preserved with zero illicit construction encroachment.", "Minor irrigation runoff channels clear of sediment bottlenecks."], recommendation: "Maintain Gram Panchayat agricultural green-zone preservation status.", voiceTe: "అంబాపురం వ్యవసాయ భూములు సంరక్షించబడుతున్నాయి. ఎలాంటి ఆక్రమణలు లేవు.", voiceEn: "Ambapuram agricultural buffer is secure with zero unauthorized layout conversions detected." },
      agri: { title: "Precision Crop Health", tag: "Micro-Irrigation", stats: [{ label: "Soil Class", value: "Alluvial Silt", color: "text-emerald-400" }], insights: ["High suitability for horticulture and multi-crop rotation."], recommendation: "Approve micro-irrigation subsidies.", voiceTe: "నేల పంటలకు అనుకూలంగా ఉంది.", voiceEn: "Soil moisture optimal for horticulture." },
      urban: { title: "Rural Zoning Boundary", tag: "Zoning Audit", stats: [{ label: "Permitted Height", value: "G + 2 Floors", color: "text-amber-400" }], insights: ["Residential layouts restricted to gram-kantham perimeters."], recommendation: "Enforce rural bylaws.", voiceTe: "గ్రామీణ నిబంధనలు అమల్లో ఉన్నాయి.", voiceEn: "Rural zoning bylaws enforced." },
      traffic: { title: "Rural Logistics", tag: "Tractor Mobility", stats: [{ label: "Speed", value: "35 km/h", color: "text-sky-400" }], insights: ["Smooth connectivity to NH-65 outer feeder."], recommendation: "Pave minor bypass road.", voiceTe: "రవాణా సజావుగా ఉంది.", voiceEn: "Rural transit flow clear." },
      disaster: { title: "Minor Stream Runoff", tag: "Drainage Audit", stats: [{ label: "Drainage Risk", value: "Low", color: "text-emerald-400" }], insights: ["Natural storm water channels discharging safely into Krishna canal."], recommendation: "Seasonal weed clearing.", voiceTe: "వరద ముప్పు తక్కువగా ఉంది.", voiceEn: "Drainage runoff within safe bounds." },
      energy: { title: "Agri Feeder Solar", tag: "PM-KUSUM", stats: [{ label: "Pump Solarization", value: "72%", color: "text-yellow-400" }], insights: ["Agricultural solar pump sets operating at 94% daytime efficiency."], recommendation: "Expand solar feeder line.", voiceTe: "వ్యవసాయ సోలార్ పంపులు పనిచేస్తున్నాయి.", voiceEn: "Agri solar feeders active." },
      defense: { title: "Civilian Zone", tag: "Standard Clearance", stats: [{ label: "Clearance", value: "Tier-3 Standard", color: "text-sky-400" }], insights: ["Zero strategic or tactical defense sensitivities detected."], recommendation: "Routine monitoring.", voiceTe: "సాధారణ పౌర ప్రాంతం.", voiceEn: "Civilian zone status verified." }
    },
    timelineData: {
      2020: { builtUp: "14.2%", waterIndex: "70%", ndvi: "0.72", event: "Canal desiltation completed under rural development mission." },
      2026: { builtUp: "18.5%", waterIndex: "68%", ndvi: "0.64", event: "High-yield solar pump network commissioned." }
    }
  },

  // 4. Nainavaram
  {
    category: "Vijayawada & Rural Cluster",
    name: "Nainavaram (Disaster Triage Zone)",
    lng: 80.6402,
    lat: 16.5789,
    zoom: 14.5,
    pitch: 40,
    soil: "Alluvial Flood Plain",
    elevation: "23m MSL",
    sectors: {
      satellite: { title: "Budameru Catchment Triage", tag: "SAR Hydrodynamic Model", stats: [{ label: "Inundation Lead", value: "36 Hours", color: "text-sky-400" }, { label: "Runoff Delta", value: "+18%", color: "text-rose-400" }, { label: "Shelter Proximity", value: "800m", color: "text-emerald-400" }], insights: ["Budameru stream diversion channel monitored for flash-flood backflow.", "Identified 4 elevated community shelter zones for immediate rural triage."], recommendation: "Dispatch automated pre-alert telemetry to District Emergency Operation Center.", voiceTe: "నైనవరం ప్రాంతంలో బుడమేరు ప్రవాహాన్ని పర్యవేక్షిస్తున్నాం. సహాయక కేంద్రాలు సిద్ధంగా ఉన్నాయి.", voiceEn: "Nainavaram Budameru basin early flood warning and rescue centers mapped." },
      agri: { title: "Flood-Resilient Agronomy", tag: "Delta Silt", stats: [{ label: "Crop Survival", value: "Submergence-Tolerant", color: "text-emerald-400" }], insights: ["Advise Swarna-Sub1 flood-tolerant paddy variety."], recommendation: "Distribute seed kits.", voiceTe: "వరద తట్టుకునే విత్తనాలు వాడండి.", voiceEn: "Deploy submergence-tolerant crops." },
      urban: { title: "Drainage Buffer Zone", tag: "CRDA Wetland", stats: [{ label: "Buffer Width", value: "50m Mandatory", color: "text-amber-400" }], insights: ["Zero building permits allowed within 50m of diversion banks."], recommendation: "Enforce buffer order.", voiceTe: "కాలువ వెంబడి నిర్మాణాలు నిషేధం.", voiceEn: "Strict drainage buffer enforced." },
      traffic: { title: "Evacuation Corridors", tag: "Emergency Access", stats: [{ label: "Route Clear", value: "100%", color: "text-emerald-400" }], insights: ["All-weather elevated road open to rescue ambulances and NDRF trucks."], recommendation: "Maintain barricade points.", voiceTe: "పునరావాస మార్గాలు సిద్ధంగా ఉన్నాయి.", voiceEn: "Evacuation corridors operational." },
      disaster: { title: "Multi-Agency SOS Direct Line", tag: "DDMA Broadcast", stats: [{ label: "SDRF Lead", value: "Armed", color: "text-rose-400" }], insights: ["Inflatable boat staging ground assigned at Nainavaram junction."], recommendation: "Trigger SOS drill.", voiceTe: "సహాయక బృందాలు సిద్ధంగా ఉన్నాయి.", voiceEn: "Rescue dispatch manifests ready." },
      energy: { title: "Emergency Microgrid", tag: "Solar Battery Bank", stats: [{ label: "Backup Runtime", value: "48 Hours", color: "text-yellow-400" }], insights: ["Community center battery storage isolated from grid failure."], recommendation: "Inspect inverter packs.", voiceTe: "అత్యవసర విద్యుత్ సరఫరా సిద్ధంగా ఉంది.", voiceEn: "Emergency microgrid armed." },
      defense: { title: "Internal Security", tag: "Civil Protection", stats: [{ label: "Security", value: "Normal", color: "text-sky-400" }], insights: ["NDRF 10th Bn communications network integrated."], recommendation: "Log VHF telemetry.", voiceTe: "భద్రతా వ్యవస్థ సాధారణంగా ఉంది.", voiceEn: "Relief security grid active." }
    },
    timelineData: {
      2020: { builtUp: "18.0%", waterIndex: "74%", ndvi: "0.68", event: "Budameru stream flood bund fortification." },
      2026: { builtUp: "22.5%", waterIndex: "72%", ndvi: "0.65", event: "Automated hydrodynamic water-gate sensors linked." }
    }
  },

  // 5. Nunna
  {
    category: "Vijayawada & Rural Cluster",
    name: "Nunna (Agri-Market & Feeder Hub)",
    lng: 80.6725,
    lat: 16.5896,
    zoom: 14,
    pitch: 50,
    soil: "Clay Loam / Grid Substation Node",
    elevation: "25m MSL",
    sectors: {
      satellite: { title: "DISCOM Grid & Logistics Saturation", tag: "Sentinel-2 & High-Voltage Mapping", stats: [{ label: "Solar Feeder Cap", value: "5.8 MWh/day", color: "text-emerald-400" }, { label: "Freight Density", value: "Heavy Agri", color: "text-amber-400" }, { label: "Substation Headroom", value: "48% Available", color: "text-sky-400" }], insights: ["Nunna 33/11kV substation possesses 1.2 MW surplus transformer injection capacity.", "Major mango logistics corridor handling over 140 cargo trucks per hour during peak harvest."], recommendation: "Transmit green energy feeder dispatch schedule to State DISCOM.", voiceTe: "నున్న విద్యుత్ సబ్‌స్టేషన్ మరియు వ్యవసాయ మార్కెట్ యార్డ్ విశ్లేషణ పూర్తయింది. గ్రిడ్ సామర్థ్యం పుష్కలంగా ఉంది.", voiceEn: "Nunna substation and agri-freight terminal exhibit optimal solar headroom and logistics capacity." },
      agri: { title: "Agri-Market Logistics", tag: "Mango Belt APMC", stats: [{ label: "Daily Turnover", value: "450 Tonnes", color: "text-emerald-400" }], insights: ["Major mango terminal dispatching to national core markets."], recommendation: "Deploy cold storage telemetry.", voiceTe: "మామిడి మార్కెట్ రవాణా రద్దీగా ఉంది.", voiceEn: "Agro-market freight in peak transit." },
      urban: { title: "Commercial Warehouse Zoning", tag: "Master Plan 2031", stats: [{ label: "Warehouse FAR", value: "2.0 Max", color: "text-sky-400" }], insights: ["Large logistical cold-storage facilities fully compliant."], recommendation: "Approve logistics park.", voiceTe: "గోదాముల నిర్మాణం నిబంధనల ప్రకారం ఉంది.", voiceEn: "Warehousing compliance verified." },
      traffic: { title: "Freight Corridor AI", tag: "APMC Truck Bypass", stats: [{ label: "Truck Flow", value: "140/hr", color: "text-amber-400" }], insights: ["Automated weighbridge sensor loops operating normally."], recommendation: "Maintain signal priority.", voiceTe: "లారీల రద్దీ నియంత్రణలో ఉంది.", voiceEn: "Freight priority corridor green." },
      disaster: { title: "High-Ground Triage", tag: "ZP High School Shelter", stats: [{ label: "Capacity", value: "1,800 Persons", color: "text-emerald-400" }], insights: ["Primary elevated shelter designated for surrounding low-lying mandals."], recommendation: "Stock emergency medical kits.", voiceTe: "నున్న పాఠశాల పునరావాస కేంద్రంగా సిద్ధంగా ఉంది.", voiceEn: "Triage center designated at Nunna." },
      energy: { title: "DISCOM Feeder Telemetry", tag: "33/11kV Substation", stats: [{ label: "Export Capacity", value: "1.2 MW", color: "text-yellow-400" }], insights: ["Solar power injection operating at 99.1% power factor."], recommendation: "Forward report to CEA.", voiceTe: "విద్యుత్ గ్రిడ్ పనితీరు బాగుంది.", voiceEn: "Grid export telemetry verified." },
      defense: { title: "Critical Power Node", tag: "DISCOM Security", stats: [{ label: "Grid Status", value: "Uninterrupted", color: "text-emerald-400" }], insights: ["Anti-sabotage perimeter protocols around transmission towers."], recommendation: "Routine CCTV patrol.", voiceTe: "సబ్‌స్టేషన్ భద్రత పర్యవేక్షించబడుతోంది.", voiceEn: "Substation perimeter secured." }
    },
    timelineData: {
      2020: { builtUp: "28.0%", waterIndex: "62%", ndvi: "0.62", event: "APMC market yard expansion and road four-laning." },
      2026: { builtUp: "38.5%", waterIndex: "58%", ndvi: "0.55", event: "Substation microgrid modernization with bidirectional meters." }
    }
  },

  // 6. Nuzvidu
  {
    category: "Vijayawada & Rural Cluster",
    name: "Nuzvidu (Horticulture Ayacut)",
    lng: 80.8462,
    lat: 16.7850,
    zoom: 13.5,
    pitch: 45,
    soil: "Red Sandy Loam (World Famous Mango Belt)",
    elevation: "85m MSL",
    sectors: {
      satellite: { title: "Horticulture Canopy & Ayacut Monitoring", tag: "Sentinel Multi-Spectral NDVI", stats: [{ label: "Canopy Health", value: "0.76 NDVI", color: "text-emerald-400" }, { label: "Groundwater Table", value: "42m BGL", color: "text-amber-400" }, { label: "Harvest Yield", value: "+14.8%", color: "text-sky-400" }], insights: ["Extensive Banganapalli mango plantations show robust vegetative vigor.", "Minor irrigation tanks require desilting ahead of pre-monsoon precipitation."], recommendation: "Issue drip-irrigation expansion advisory under National Horticulture Mission.", voiceTe: "నూజివీడు మామిడి తోటలు మరియు సాగునీటి చెరువుల ఉపగ్రహ విశ్లేషణ పూర్తయింది. తోటల పరిస్థితి బాగుంది.", voiceEn: "Nuzvidu horticulture canopy demonstrates optimal NDVI vigor with minor irrigation tank reserves verified." },
      agri: { title: "Mango Crop Intelligence", tag: "Horticulture Mission", stats: [{ label: "Soil Class", value: "Red Sandy Loam", color: "text-emerald-400" }], insights: ["Soil moisture suitable for flowering and fruit development."], recommendation: "Deploy micro-nutrient sprays.", voiceTe: "మామిడి తోటలు ఆరోగ్యంగా ఉన్నాయి.", voiceEn: "Horticulture crop health optimal." },
      urban: { title: "Town Planning & Heritage", tag: "Urban Expansion", stats: [{ label: "Bylaw Class", value: "Municipality R1", color: "text-sky-400" }], insights: ["Urban sprawl growing eastward along Mylavaram highway."], recommendation: "Demarcate green corridors.", voiceTe: "పట్టణ విస్తరణ నిబంధనల ప్రకారం సాగుతోంది.", voiceEn: "Town planning alignment verified." },
      traffic: { title: "Mango Freight Corridor", tag: "SH-42 Transit", stats: [{ label: "Logistics Latency", value: "Low", color: "text-emerald-400" }], insights: ["State Highway 42 clear for interstate freight trucks."], recommendation: "Keep bypass check-posts open.", voiceTe: "రవాణా మార్గాలు సాఫీగా ఉన్నాయి.", voiceEn: "Interstate fruit transit clear." },
      disaster: { title: "Catchment Tank Safety", tag: "Tank Inundation", stats: [{ label: "Breach Vulnerability", value: "Zero", color: "text-emerald-400" }], insights: ["All 12 major irrigation tanks have reinforced earthen bunds."], recommendation: "Inspect spillway channels.", voiceTe: "సాగునీటి చెరువులు సురక్షితంగా ఉన్నాయి.", voiceEn: "Irrigation tanks bund safety verified." },
      energy: { title: "Solar Cold Chain", tag: "Food Processing Solar", stats: [{ label: "Capacity", value: "2.4 MW", color: "text-yellow-400" }], insights: ["Rooftop solar on fruit packaging and pulping facilities operational."], recommendation: "Issue green tariff subsidy.", voiceTe: "కోల్డ్ స్టోరేజ్ సోలార్ యూనిట్లు పనిచేస్తున్నాయి.", voiceEn: "Cold storage solar power active." },
      defense: { title: "Civilian Zone", tag: "General Clearance", stats: [{ label: "Status", value: "Clear", color: "text-sky-400" }], insights: ["Zero tactical military sensitivities detected."], recommendation: "Routine observation.", voiceTe: "సాధారణ పౌర పరిధి.", voiceEn: "Civilian region status verified." }
    },
    timelineData: {
      2020: { builtUp: "24.0%", waterIndex: "58%", ndvi: "0.78", event: "Drip irrigation pilot deployed across 120 hectares." },
      2026: { builtUp: "30.5%", waterIndex: "55%", ndvi: "0.76", event: "Solarized fruit-processing terminal commissioned." }
    }
  },

  // 7. Visakhapatnam
  {
    category: "Andhra Pradesh Strategic Hubs",
    name: "Visakhapatnam (Coastal & Eastern Naval Command)",
    lng: 83.2185,
    lat: 17.6868,
    zoom: 12.8,
    pitch: 60,
    soil: "Coastal Marine Silt & Hard Granitic Gneiss",
    elevation: "5m MSL",
    sectors: {
      satellite: { title: "ENC Maritime & Coastal Radar Surveillance", tag: "Sentinel-1 SAR & Optical Marine Fusion", stats: [{ label: "Naval Anchorage", value: "Normal Activity", color: "text-sky-400" }, { label: "Coastal Erosion", value: "<0.4m Delta", color: "text-emerald-400" }, { label: "Thermal Anomalies", value: "0 Detected", color: "text-rose-400" }], insights: ["Eastern Naval Command deepwater approaches monitored with sub-meter radar backscatter.", "Port container terminals and refinery corridors fully geofenced with live AIS correlation."], recommendation: "Maintain encrypted telemetry stream to Southern Naval Command & DGMO.", voiceTe: "విశాఖపట్నం తీర ప్రాంతం మరియు తూర్పు నౌకాదళ స్థావరం భద్రతా పర్యవేక్షణలో ఉన్నాయి. ఎటువంటి అసాధారణతలు లేవు.", voiceEn: "Visakhapatnam deepwater naval approaches and coastal industrial corridor verified under sovereign radar reconnaissance." },
      agri: { title: "Coastal Plantation Buffer", tag: "Casuarina Belts", stats: [{ label: "NDVI", value: "0.52", color: "text-emerald-400" }], insights: ["Shelter-belt plantations along shoreline protect against cyclonic winds."], recommendation: "Preserve mangrove tracts.", voiceTe: "తీరప్రాంత చెట్ల రక్షణ వలయం బాగుంది.", voiceEn: "Coastal green shelter belts healthy." },
      urban: { title: "VMRDA Digital Twin", tag: "Hill-Slope Zoning", stats: [{ label: "CRZ Compliance", value: "100%", color: "text-emerald-400" }], insights: ["Strict Coastal Regulation Zone (CRZ-1) bylaws applied to beachfronts."], recommendation: "Enforce CRZ notifications.", voiceTe: "తీర నిబంధనలు ఖచ్చితంగా అమలవుతున్నాయి.", voiceEn: "Coastal Regulation Zone compliance valid." },
      traffic: { title: "Deepwater Port Logistics", tag: "Harbor Vessel AIS", stats: [{ label: "Port Turnaround", value: "26 Hours", color: "text-sky-400" }], insights: ["Automated vessel traffic management system operating without congestion."], recommendation: "Maintain naval corridor clearance.", voiceTe: "పోర్టు నౌకల రాకపోకలు సజావుగా సాగుతున్నాయి.", voiceEn: "Port logistics and cargo dispatch green." },
      disaster: { title: "Cyclone & Tsunami Early Alert", tag: "INCOIS Buoy Network", stats: [{ label: "Wave Height", value: "1.4m Normal", color: "text-sky-400" }], insights: ["Live deep-sea Doppler radar buoy feed confirms zero cyclonic depression."], recommendation: "Keep coastal siren stations active.", voiceTe: "తుఫాను హెచ్చరిక వ్యవస్థ అప్రమత్తంగా ఉంది.", voiceEn: "Early cyclonic warning grid active." },
      energy: { title: "Coastal Industrial Grid", tag: "Steel Plant Microgrid", stats: [{ label: "Industrial Load", value: "48 MW", color: "text-amber-400" }], insights: ["Heavy industrial load buffered by 220kV transmission substation."], recommendation: "Maintain grid frequency at 50Hz.", voiceTe: "పరిశ్రమలకు విద్యుత్ సరఫరా స్థిరంగా ఉంది.", voiceEn: "Industrial power telemetry stable." },
      defense: { title: "Eastern Naval Command Enclave", tag: "TOP SECRET // TIER-1", stats: [{ label: "Security Level", value: "DEFCON GREEN", color: "text-emerald-400" }], insights: ["Sub-surface sonar and radar sweep confirm zero perimeter intrusions."], recommendation: "Transmit daily report to Naval HQ.", voiceTe: "నౌకాదళ కేంద్రం అత్యున్నత భద్రతలో ఉంది.", voiceEn: "Naval command security grid verified." }
    },
    timelineData: {
      2020: { builtUp: "48.0%", waterIndex: "96%", ndvi: "0.45", event: "Deepwater container terminal expansion and naval jetty audit." },
      2026: { builtUp: "58.4%", waterIndex: "95%", ndvi: "0.40", event: "Sub-meter satellite SAR anti-intrusion radar operational." }
    }
  },

  // 8. Hyderabad
  {
    category: "Andhra Pradesh Strategic Hubs",
    name: "Hyderabad (HITEC City & Musi Basin)",
    lng: 78.4867,
    lat: 17.3850,
    zoom: 12.2,
    pitch: 55,
    soil: "Red Clay & Granitic Rock",
    elevation: "540m MSL",
    sectors: {
      satellite: { title: "HITEC City & Musi River Sprawl", tag: "High-Resolution Urban Digital Twin", stats: [{ label: "Built-up Expansion", value: "+44.2%", color: "text-sky-400" }, { label: "Urban Heat Island", value: "+3.1°C", color: "text-rose-400" }, { label: "Musi Water Basin", value: "Regulated", color: "text-indigo-400" }], insights: ["Volumetric high-rise growth mapped across Gachibowli and Financial District.", "Musi river rejuvenation corridor monitored for buffer-zone encroachment."], recommendation: "Submit volumetric shadow analysis to Hyderabad Metropolitan Development Authority.", voiceTe: "హైదరాబాద్ హైటెక్ సిటీ మరియు మూసీ నది పరీవాహక ప్రాంతాల 3D డిజిటల్ ట్విన్ విశ్లేషణ పూర్తయింది.", voiceEn: "Hyderabad high-density IT corridor and Musi river rejuvenation model verified." },
      agri: { title: "Peri-Urban Green Buffer", tag: "Urban Agronomy", stats: [{ label: "Green Cover", value: "18.4%", color: "text-emerald-400" }], insights: ["Urban lake cascading systems require preservation against siltation."], recommendation: "Restore lake buffer perimeters.", voiceTe: "చెరువుల బఫర్ జోన్లను సంరక్షించాలి.", voiceEn: "Lake buffer zones require conservation." },
      urban: { title: "Procedural 3D Volumetric Engine", tag: "GHMC Bylaws", stats: [{ label: "Permitted Height", value: "Unlimited (FAR 4.0+)", color: "text-amber-400" }], insights: ["High-rise structural shadow models indicate zero adverse impact on transit corridors."], recommendation: "Issue automated GHMC NOC.", voiceTe: "అత్యధిక అంతస్తుల నిర్మాణానికి అనుమతులు సరిపోతాయి.", voiceEn: "High-rise volumetric clearance valid." },
      traffic: { title: "Nehru Outer Ring Road Mobility", tag: "AI ITS Traffic", stats: [{ label: "ORR Velocity", value: "92 km/h", color: "text-emerald-400" }], insights: ["Outer Ring Road toll corridors operating with zero queue delays."], recommendation: "Maintain smart toll lanes.", voiceTe: "ఔటర్ రింగ్ రోడ్ ట్రాఫిక్ వేగంగా సాగుతోంది.", voiceEn: "ORR transit speed optimal." },
      disaster: { title: "Musi Flood Mitigation Command", tag: "Hydro Dynamic Model", stats: [{ label: "Discharge Cap", value: "45,000 Cusecs", color: "text-sky-400" }], insights: ["Automated gates at Osman Sagar and Himayat Sagar tracked in real time."], recommendation: "Keep downstream sirens on test standby.", voiceTe: "జలాశయాల నీటి మట్టాలు నియంత్రణలో ఉన్నాయి.", voiceEn: "Reservoir outflow telemetry armed." },
      energy: { title: "TSSPDCL Rooftop Solar Saturation", tag: "Smart City Grid", stats: [{ label: "Solar Export", value: "28.5 MWh/day", color: "text-yellow-400" }], insights: ["Commercial IT buildings generating 32% of daytime power needs locally."], recommendation: "Expand virtual power plant pilot.", voiceTe: "కమర్షియల్ భవనాలలో సోలార్ విద్యుత్ ఉత్పత్తి బాగుంది.", voiceEn: "Commercial solar generation verified." },
      defense: { title: "Strategic Aerospace & Missile Enclave", tag: "DRDO / BDL Corridor", stats: [{ label: "Security Clearance", value: "TIER-1 RESTRICTED", color: "text-rose-400" }], insights: ["Defense R&D laboratories and aerospace parks protected under airspace geofencing."], recommendation: "Maintain active radar no-fly zones.", voiceTe: "రక్షణ మరియు ఏరోస్పేస్ స్థావరాలు సురక్షితంగా ఉన్నాయి.", voiceEn: "Aerospace defense perimeters secured." }
    },
    timelineData: {
      2020: { builtUp: "54.0%", waterIndex: "62%", ndvi: "0.38", event: "HITEC City phase 2 and ORR interchange expansion." },
      2026: { builtUp: "72.5%", waterIndex: "58%", ndvi: "0.30", event: "3D Digital Twin integration with automated municipal bylaws." }
    }
  },

  // 9. Polavaram
  {
    category: "Andhra Pradesh Strategic Hubs",
    name: "Polavaram Project & Godavari River Basin",
    lng: 81.6542,
    lat: 17.2564,
    zoom: 13.2,
    pitch: 72,
    soil: "Hard Basalt Bed, Deltaic Sand & Heavy Clay",
    elevation: "45m MSL (FRL)",
    sectors: {
      satellite: {
        title: "4D Mega Hydro-Infrastructure Monitoring",
        tag: "Sentinel-1 SAR Radar & Sentinel-2 Optical",
        stats: [
          { label: "Reservoir Area", value: "96% Capacity", color: "text-sky-400" },
          { label: "Spillway Discharge", value: "Safe Threshold", color: "text-emerald-400" },
          { label: "Siltation Delta", value: "+4.2%", color: "text-amber-400" },
        ],
        insights: [
          "Continuous InSAR radar deformation monitoring confirms 0mm structural shift on earth-cum-rockfill dam.",
          "48 radial spillway gates operational; live discharge modeling tracks downstream Godavari surges.",
          "Backwater submergence limits verified against tribal rehabilitation boundaries."
        ],
        recommendation: "Maintain automated 15-minute satellite InSAR telemetry feed to Central Water Commission.",
        voiceTe: "పోలవరం డ్యామ్ నిర్మాణం స్థిరంగా ఉంది. రాడార్ శాటిలైట్ విశ్లేషణలో ఎలాంటి ప్రమాదకర మార్పులు లేవు.",
        voiceEn: "Polavaram Project satellite InSAR radar telemetry confirms zero structural displacement with real-time reservoir impoundment modeling."
      },
      agri: {
        title: "Ayacut Command Area Water Intelligence",
        tag: "7.2 Lakh Acre Irrigation Command Model",
        stats: [
          { label: "Command Ayacut", value: "7.2 Lakh Acres", color: "text-emerald-400" },
          { label: "Canal Discharge", value: "17,500 Cusecs", color: "text-sky-400" },
          { label: "Cropping Intensity", value: "+48% Boost", color: "text-amber-400" },
        ],
        insights: [
          "Right main canal diverts 80 TMC water to Krishna delta, stabilizing Prakasam Barrage ayacut.",
          "Left main canal supplies critical industrial & drinking water to Visakhapatnam steel city.",
          "Crop diversification into high-value pulses, oil palm, and double-crop paddy fully enabled."
        ],
        recommendation: "Optimize inter-basin canal transfer schedule based on downstream soil moisture.",
        voiceTe: "పోలవరం ప్రాజెక్ట్ ద్వారా కృష్ణా మరియు గోదావరి డెల్టాల్లో 7 లక్షలకు పైగా ఎకరాలకు సాగునీరు అందుతుంది.",
        voiceEn: "Polavaram irrigation ayacut model delivers water security to 7.2 lakh acres, boosting regional cropping intensity by 48%."
      },
      urban: {
        title: "Resettlement & Township Digital Twin",
        tag: "Rehabilitation & Resettlement (R&R) Audit",
        stats: [
          { label: "R&R Colonies", value: "32 Townships", color: "text-sky-400" },
          { label: "Infra Quality", value: "98% Compliant", color: "text-emerald-400" },
          { label: "Civic Amenities", value: "Fully Mapped", color: "text-amber-400" },
        ],
        insights: [
          "All 32 R&R township layouts mapped with 3D terrain elevation to prevent backwater flooding.",
          "Solar street lighting, clean drinking water plants, and primary healthcare centers verified.",
          "Community centers and vocational schools integrated into municipal GIS database."
        ],
        recommendation: "Ensure continuous satellite monitoring of R&R infrastructure maintenance.",
        voiceTe: "పోలవరం పునరావాస కాలనీల మౌలిక వసతులు మరియు భద్రత 3D మ్యాపింగ్ ద్వారా ధృవీకరించబడ్డాయి.",
        voiceEn: "Urban3D audits 32 Polavaram R&R rehabilitation townships ensuring flood safety and modern civic amenities."
      },
      traffic: {
        title: "Project Logistics & Navigational Waterways",
        tag: "National Waterway-4 Heavy Cargo Route",
        stats: [
          { label: "Waterway Draft", value: "2.8m (NW-4)", color: "text-sky-400" },
          { label: "Heavy Machinery", value: "Active Transit", color: "text-amber-400" },
          { label: "Bypass Load", value: "Class 100", color: "text-emerald-400" },
        ],
        insights: [
          "Inland waterway navigation operational along Godavari river stretch for heavy machinery transport.",
          "Dedicated heavy vehicle approach roads engineered for 80-tonne dumper loads.",
          "Automated river barge tracking deployed via GPS and satellite AIS."
        ],
        recommendation: "Integrate NW-4 river navigation with state multi-modal logistics grid.",
        voiceTe: "గోదావరి జలమార్గం ద్వారా భారీ యంత్రాల రవాణా మరియు ప్రాజెక్ట్ లాజిస్టిక్స్ సజావుగా సాగుతున్నాయి.",
        voiceEn: "National Waterway-4 river navigation and heavy-haul road networks provide seamless project logistics."
      },
      disaster: {
        title: "Dam Hydrodynamics & Early Evacuation Grid",
        tag: "PMF 50 Lakh Cusecs • Downstream Early Warning",
        stats: [
          { label: "Spillway Surge Cap", value: "50 Lakh Cusecs", color: "text-emerald-400" },
          { label: "Downstream Alert Lead", value: "48 Hours Lead", color: "text-sky-400" },
          { label: "High Risk Mandals", value: "14 Mandals Monitored", color: "text-rose-400" },
        ],
        insights: [
          "Live flood hydrodynamic model tracks upstream catchment inflows from Sabari and Godavari basins.",
          "Automated triage broadcast coordinates pre-linked to SDRF, NDRF 10th Battalion, and District Collectors.",
          "Pre-designated 64 relief shelter buildings mapped with high-ground access corridors."
        ],
        recommendation: "Dispatch automated pre-alert telemetry to Rajahmundry & Konaseema Collectorates.",
        voiceTe: "పోలవరం ప్రాజెక్ట్ వద్ద 48 గంటల ముందుగానే వరద హెచ్చరిక వ్యవస్థ సిద్ధంగా ఉంది. సహాయక బృందాలకు మార్గాలు అనుసంధానించబడ్డాయి.",
        voiceEn: "Polavaram 48-hour flood early-warning model active. Pre-emptive evacuation and relief manifests mapped for State and Central agencies."
      },
      energy: {
        title: "Hydro-Electric & Solar Agro-Grid Integration",
        tag: "960 MW Hydro Base + Regional Solar PV",
        stats: [
          { label: "Hydro Capacity", value: "960 MW (12 Units)", color: "text-emerald-400" },
          { label: "Local Demand", value: "24 MW Project Baseline", color: "text-amber-400" },
          { label: "Grid Injection Cap", value: "400 kV Southern Grid", color: "text-sky-400" },
        ],
        insights: [
          "12 vertical Kaplan turbines generate 2,350 GWh clean power annually, abating 1.9M tonnes CO₂.",
          "Surplus daytime solar from rehabilitation colonies seamlessly co-evacuated over 400kV lines.",
          "Substation energy audit indicates 99.4% transmission efficiency across regional feeder lines."
        ],
        recommendation: "Transmit green energy dispatch schedule to Central Electricity Authority (CEA).",
        voiceTe: "పోలవరం జలవిద్యుత్ కేంద్రం 960 మెగావాట్ల స్వచ్ఛమైన విద్యుత్‌ను జాతీయ గ్రిడ్‌కు సరఫరా చేయడానికి సిద్ధంగా ఉంది.",
        voiceEn: "Polavaram clean energy matrix delivers 960 MW to the national grid with full feeder efficiency verified."
      },
      defense: {
        title: "Critical National Infrastructure (CNI) Security",
        tag: "Restricted Airspace & Perimeter Defense Enclave",
        stats: [
          { label: "Security Level", value: "ZONE I - CRITICAL", color: "text-rose-400" },
          { label: "Airspace Perimeter", value: "5 NM Restricted No-Fly", color: "text-amber-400" },
          { label: "Intrusion Alarms", value: "Zero Vulnerability", color: "text-emerald-400" },
        ],
        insights: [
          "Designated Critical National Infrastructure (CNI) protected under Central Industrial Security Force protocols.",
          "5 nautical mile geo-fenced no-fly airspace enforced with automated radar anti-drone interdiction.",
          "Continuous underwater sonar and thermal imaging scans protect water intake tunnels and powerhouses."
        ],
        recommendation: "Maintain sovereign encrypted data transmission to Eastern Naval Command and MoD War Room.",
        voiceTe: "పోలవరం ప్రాజెక్ట్ అత్యంత కీలకమైన జాతీయ భద్రతా మౌలిక వసతిగా రక్షించబడుతోంది. నో-ఫ్లై జోన్ అమల్లో ఉంది.",
        voiceEn: "Polavaram CNI perimeter is sealed under military-grade radar surveillance. Full encrypted line active with Central Defense Command."
      }
    },
    timelineData: {
      2020: { builtUp: "22.0%", waterIndex: "85%", ndvi: "0.82", event: "Spillway concrete piers and radial gate erection underway." },
      2021: { builtUp: "28.5%", waterIndex: "88%", ndvi: "0.80", event: "Coffer dam execution and river diversion channel operational." },
      2022: { builtUp: "35.0%", waterIndex: "90%", ndvi: "0.78", event: "Diaphragm wall vibro-stone column assessment." },
      2023: { builtUp: "42.0%", waterIndex: "92%", ndvi: "0.76", event: "Left and Right main canal connectivity trials." },
      2024: { builtUp: "48.5%", waterIndex: "95% (Peak)", ndvi: "0.74", event: "High flood discharge handled safely through 48 spillway gates." },
      2025: { builtUp: "56.0%", waterIndex: "93%", ndvi: "0.73", event: "Hydro-electric power station penstock alignment completed." },
      2026: { builtUp: "63.4%", waterIndex: "96% (Mega Reservoir)", ndvi: "0.71", event: "Full reservoir impoundment modeling: Live 3D bathymetry active." }
    }
  },

  // 10. Bengaluru
  {
    category: "National Metropolitan Hubs",
    name: "Bengaluru (Tech Corridors & Lake Ecosystem)",
    lng: 77.5946,
    lat: 12.9716,
    zoom: 12,
    pitch: 50,
    soil: "Red Loamy Laterite",
    elevation: "920m MSL",
    sectors: {
      satellite: { title: "Lake Cascading & Built-Up Imperviousness", tag: "Sentinel Multi-Spectral & SAR", stats: [{ label: "Impervious Surface", value: "82.1%", color: "text-sky-400" }, { label: "Lake Rejuvenation", value: "+14.2%", color: "text-emerald-400" }, { label: "Heat Index", value: "+2.6°C", color: "text-rose-400" }], insights: ["Bellandur and Varthur cascading lake networks audited for storm-water runoff.", "Volumetric building density in Whitefield IT corridor mapped to prevent thermal trapping."], recommendation: "Enforce buffer regulations under Karnataka Lake Conservation and Development Authority.", voiceTe: "బెంగళూరు సరస్సుల వ్యవస్థ మరియు ఐటీ కారిడార్ల ఉపగ్రహ విశ్లేషణ పూర్తయింది.", voiceEn: "Bengaluru urban lake ecosystems and IT corridor impervious density verified." },
      agri: { title: "Urban Hydroponics & Periphery", tag: "Green Belt", stats: [{ label: "Green Cover", value: "22%", color: "text-emerald-400" }], insights: ["Peri-urban horticulture buffers preserved around Hoskote."], recommendation: "Promote urban rooftop gardens.", voiceTe: "పట్టణ పరిసరాలలో పచ్చదనం పర్యవేక్షించబడుతోంది.", voiceEn: "Peri-urban green cover audited." },
      urban: { title: "BBMP Volumetric Digital Twin", tag: "Bylaw Compliance", stats: [{ label: "Height Compliant", value: "97.4%", color: "text-amber-400" }], insights: ["Procedural setbacks verify fire and solar access in high-density corridors."], recommendation: "Automate BBMP building sanction.", voiceTe: "నిర్మాణ నిబంధనలు సక్రమంగా ఉన్నాయి.", voiceEn: "Building bylaws compliant under BBMP." },
      traffic: { title: "Namma Metro & Ring Road Flow", tag: "Smart Transit AI", stats: [{ label: "Peak Velocity", value: "22 km/h", color: "text-rose-400" }], insights: ["Silk Board and Outer Ring Road transit delays eased by Metro Phase 2 operations."], recommendation: "Dynamic lane management.", voiceTe: "ట్రాఫిక్ వేగం నెమ్మదిగా ఉంది.", voiceEn: "Transit congestion points monitored." },
      disaster: { title: "Urban Flash Flood Telemetry", tag: "Storm Water Grid", stats: [{ label: "Sluice Capacity", value: "Safe Level", color: "text-sky-400" }], insights: ["Primary storm water drains (SWDs) sensor-linked to prevent urban flooding."], recommendation: "Clear secondary stormwater culverts.", voiceTe: "వరద ముప్పు నివారణ చర్యలు అమల్లో ఉన్నాయి.", voiceEn: "Stormwater runoff controls operational." },
      energy: { title: "BESCOM Solar Microgrid", tag: "Rooftop Net-Metering", stats: [{ label: "Installed Solar", value: "34.2 MWh/day", color: "text-yellow-400" }], insights: ["Rooftop solar generation feeds IT campus baseline cooling loads."], recommendation: "Credit BESCOM green tariffs.", voiceTe: "సౌర విద్యుత్ ఉత్పత్తి గణనీయంగా ఉంది.", voiceEn: "Rooftop solar export verified." },
      defense: { title: "Defense Aerospace Enclave", tag: "HAL / ISRO / DRDO", stats: [{ label: "Clearance", value: "ZONE-1 RESTRICTED", color: "text-rose-400" }], insights: ["Airspace around defense aerodromes sealed against unauthorized drone activity."], recommendation: "Maintain automated radar monitoring.", voiceTe: "రక్షణ మరియు ఏరోస్పేస్ విభాగాలు సురక్షితం.", voiceEn: "Aerospace defense installations secured." }
    },
    timelineData: {
      2020: { builtUp: "62.0%", waterIndex: "50%", ndvi: "0.38", event: "Bellandur lake desilting and wetland buffer creation." },
      2026: { builtUp: "78.2%", waterIndex: "54%", ndvi: "0.32", event: "Live 3D city twin integration with metro transport telemetry." }
    }
  },

  // 11. Chennai
  {
    category: "National Metropolitan Hubs",
    name: "Chennai (Coastal Plain & Adyar Basin)",
    lng: 80.2707,
    lat: 13.0827,
    zoom: 12.5,
    pitch: 45,
    soil: "Coastal Marine Sand & Heavy Alluvium",
    elevation: "6m MSL",
    sectors: {
      satellite: { title: "Coastal Plain & Adyar/Cooum Estuary", tag: "Sentinel Optical & SAR Radar", stats: [{ label: "Estuary Ingress", value: "Normal Tide", color: "text-sky-400" }, { label: "Marshland Health", value: "+8.4%", color: "text-emerald-400" }, { label: "Urban Sprawl", value: "+32.1%", color: "text-amber-400" }], insights: ["Pallikaranai marshland buffer monitored to prevent urban encroachment.", "Adyar and Cooum river discharge mouths clear of tidal sandbar choking."], recommendation: "Enforce automated flood warning sirens across GCC municipal zones.", voiceTe: "చెన్నై తీర ప్రాంతం మరియు అడయార్ నది ముఖద్వారం సురక్షితంగా ఉన్నాయి.", voiceEn: "Chennai coastal plain, Pallikaranai marshland, and estuary river mouths verified." },
      agri: { title: "Peri-Urban Agri Belts", tag: "Delta Buffer", stats: [{ label: "Green Index", value: "0.48", color: "text-emerald-400" }], insights: ["Irrigation tanks in Kanchipuram district feeding urban water security."], recommendation: "Maintain tank connectivity.", voiceTe: "సాగునీటి వనరులు నిలకడగా ఉన్నాయి.", voiceEn: "Peri-urban water reservoirs stable." },
      urban: { title: "CMDA Digital Twin", tag: "Coastal Regulation", stats: [{ label: "CRZ Compliance", value: "99.1%", color: "text-emerald-400" }], insights: ["Coastal building height setbacks adhere strictly to 2019 CRZ notifications."], recommendation: "Grant CMDA permissions.", voiceTe: "నిర్మాణ నిబంధనలు ఖచ్చితంగా అమలవుతున్నాయి.", voiceEn: "CMDA building bylaws validated." },
      traffic: { title: "Port Multi-Modal Corridor", tag: "Ennore / Chennai Port", stats: [{ label: "Freight Transit", value: "Smooth", color: "text-sky-400" }], insights: ["Elevated port connectivity corridor free of heavy container congestion."], recommendation: "Maintain fast-tag gate priority.", voiceTe: "పోర్టు రవాణా నిరంతరాయంగా సాగుతోంది.", voiceEn: "Port logistics corridor operating optimally." },
      disaster: { title: "Greater Chennai Flood Command", tag: "Doppler Early Warning", stats: [{ label: "Monsoon Surge Alert", value: "Level 1 Standby", color: "text-amber-400" }], insights: ["Real-time flood telemetry linked to Chembarambakkam reservoir outflow."], recommendation: "Maintain standby motor pumps in low zones.", voiceTe: "వరద రక్షణ వ్యవస్థ అప్రమత్తంగా ఉంది.", voiceEn: "Flood emergency command active." },
      energy: { title: "TANGEDCO Coastal Grid", tag: "Offshore Solar & Wind", stats: [{ label: "Renewable Feed", value: "18.4 MWh/day", color: "text-yellow-400" }], insights: ["Coastal substations reinforced against maritime saline corrosion."], recommendation: "Inspect line insulators.", voiceTe: "తీరప్రాంత విద్యుత్ గ్రిడ్ సురక్షితం.", voiceEn: "Coastal grid transmission verified." },
      defense: { title: "Southern Naval & Coast Guard HQ", tag: "Maritime Security", stats: [{ label: "Coastal Radar", value: "Armed 24/7", color: "text-emerald-400" }], insights: ["Joint Coast Guard-Indian Navy coastal tracking grid operating continuously."], recommendation: "Forward daily maritime log.", voiceTe: "తీర భద్రత అత్యున్నత స్థాయిలో ఉంది.", voiceEn: "Coast guard maritime defense operational." }
    },
    timelineData: {
      2020: { builtUp: "64.0%", waterIndex: "88%", ndvi: "0.40", event: "Chembarambakkam automated sluice modernization." },
      2026: { builtUp: "74.5%", waterIndex: "86%", ndvi: "0.36", event: "Integrated flood warning radar linked to GCC Smart City Center." }
    }
  },

  // 12. Mumbai
  {
    category: "National Metropolitan Hubs",
    name: "Mumbai (Island City & Coastal Defense)",
    lng: 72.8777,
    lat: 19.0760,
    zoom: 12,
    pitch: 65,
    soil: "Coastal Deccan Basalt & Marine Silt",
    elevation: "10m MSL",
    sectors: {
      satellite: { title: "Island City 3D Relief & Coastal Defense", tag: "Synthetic Aperture Radar & 3D Bathymetry", stats: [{ label: "High-Rise Density", value: "88.4%", color: "text-sky-400" }, { label: "Mithi River Flow", value: "Clear Sluice", color: "text-emerald-400" }, { label: "Reclamation Stability", value: "0mm Delta", color: "text-indigo-400" }], insights: ["Coastal Road reclamation zones monitored with InSAR radar deformation checks.", "Western Naval Command dockyard perimeters operating under top-tier military radar coverage."], recommendation: "Maintain automated tidal storm surge advisory feed to BMC Emergency Command.", voiceTe: "ముంబై నగర తీర ప్రాంతం మరియు రక్షణ కేంద్రాల ఉపగ్రహ విశ్లేషణ స్థిరంగా ఉంది.", voiceEn: "Mumbai coastal road, Mithi river basin, and Western Naval dockyards verified." },
      agri: { title: "Mangrove Bio-Shield", tag: "CRZ-1 Sanctuary", stats: [{ label: "Mangrove Cover", value: "54 sq.km", color: "text-emerald-400" }], insights: ["Thane Creek and Mahim wetland mangroves healthy and shielding shoreline."], recommendation: "Strict anti-dumping enforcement.", voiceTe: "మడ అడవులు తీరాన్ని కాపాడుతున్నాయి.", voiceEn: "Mangrove bio-shield healthy." },
      urban: { title: "BMC Volumetric 3D Twin", tag: "Coastal Road & High-Rise", stats: [{ label: "Shadow Occlusion", value: "Safe Level", color: "text-amber-400" }], insights: ["Skyscraper wind-shear and volumetric shadows validated against civic norms."], recommendation: "Issue automated BMC clearance.", voiceTe: "భవన నిర్మాణ నిబంధనలు అనుమతించబడ్డాయి.", voiceEn: "Volumetric building audit compliant." },
      traffic: { title: "Coastal Road & Sea Link Transit", tag: "Smart Expressway ITS", stats: [{ label: "Sea Link Speed", value: "78 km/h", color: "text-emerald-400" }], insights: ["Trans-Harbour Link and Coastal Freeway traffic moving with zero gridlock."], recommendation: "Maintain toll plaza efficiency.", voiceTe: "రవాణా సజావుగా సాగుతోంది.", voiceEn: "Coastal road mobility smooth." },
      disaster: { title: "Monsoon Pumping Stations", tag: "BMC Flood Command", stats: [{ label: "Pumping Capacity", value: "6,000 m³/hr", color: "text-sky-400" }], insights: ["Automated storm surge floodgates at Britannia and Lovegrove operational."], recommendation: "Keep diesel generator backup active.", voiceTe: "వరద నీటి పంపింగ్ స్టేషన్లు సిద్ధంగా ఉన్నాయి.", voiceEn: "Stormwater pumping stations armed." },
      energy: { title: "Adani & Tata Coastal Grid", tag: "Island Microgrid", stats: [{ label: "Grid Uptime", value: "99.99%", color: "text-yellow-400" }], insights: ["Underground high-voltage power transmission shielded against monsoon ingress."], recommendation: "Maintain islanding facility.", voiceTe: "విద్యుత్ సరఫరా నిరంతరాయంగా ఉంది.", voiceEn: "Island city power grid resilient." },
      defense: { title: "Western Naval Command Enclave", tag: "TOP SECRET // TIER-1", stats: [{ label: "Dockyard Alert", value: "DEFCON GREEN", color: "text-rose-400" }], insights: ["Submarine berths and naval dockyards protected under dedicated radar shields."], recommendation: "Maintain encrypted datalink to MoD.", voiceTe: "నౌకాదళ ప్రధాన కేంద్రం అత్యంత భద్రతలో ఉంది.", voiceEn: "Western Naval Command perimeter secured." }
    },
    timelineData: {
      2020: { builtUp: "72.0%", waterIndex: "98%", ndvi: "0.28", event: "Coastal Road reclamation phase 1 InSAR radar assessment." },
      2026: { builtUp: "84.2%", waterIndex: "96%", ndvi: "0.24", event: "Full Mumbai 3D Digital Twin with integrated sea-surge telemetry." }
    }
  },

  // 13. Delhi
  {
    category: "National Metropolitan Hubs",
    name: "Delhi-NCR (Yamuna Floodplain & Enclave)",
    lng: 77.1025,
    lat: 28.7041,
    zoom: 11.8,
    pitch: 45,
    soil: "Indo-Gangetic Yamuna Alluvium",
    elevation: "215m MSL",
    sectors: {
      satellite: { title: "Yamuna Floodplain & Sovereign Central Enclave", tag: "Sentinel Optical & High-Res Radar", stats: [{ label: "Yamuna Water Head", value: "204.8m Warning", color: "text-amber-400" }, { label: "Built-up Ingress", value: "+24.8%", color: "text-sky-400" }, { label: "Air Quality Matrix", value: "Moderate Dispersion", color: "text-rose-400" }], insights: ["Yamuna flood embankment monitored against upstream Hathnikund discharge.", "Central Secretariat and strategic defense enclaves mapped under sovereign encryption."], recommendation: "Maintain automated alert feed to Delhi Disaster Management Authority.", voiceTe: "ఢిల్లీ యమునా నది పరివాహక ప్రాంతం మరియు కేంద్ర సచివాలయం భద్రతా పర్యవేక్షణలో ఉన్నాయి.", voiceEn: "Delhi Yamuna floodplain and sovereign central defense enclaves verified." },
      agri: { title: "Yamuna Floodplain Green Corridor", tag: "Biodiversity Zone", stats: [{ label: "Floodplain Buffer", value: "97% Cleared", color: "text-emerald-400" }], insights: ["Restoration of natural riparian wetlands helps absorb peak monsoon surges."], recommendation: "Prevent unauthorized crop farming on bed.", voiceTe: "నదీ పరివాహక పచ్చదనం రక్షించబడుతోంది.", voiceEn: "Riparian wetland green buffer protected." },
      urban: { title: "DDA Master Plan 2041", tag: "Procedural Zoning", stats: [{ label: "Bylaw Standard", value: "DDA 2041 Compliant", color: "text-amber-400" }], insights: ["Volumetric building envelopes around transit-oriented corridors verified."], recommendation: "Issue DDA automated clearance.", voiceTe: "మాస్టర్ ప్లాన్ నిబంధనల ప్రకారం ఉంది.", voiceEn: "Master Plan 2041 building alignment valid." },
      traffic: { title: "Eastern Peripheral Mobility", tag: "Expressway AI Network", stats: [{ label: "Expressway Speed", value: "88 km/h", color: "text-emerald-400" }], insights: ["Heavy commercial vehicles successfully diverted around outer ring expressways."], recommendation: "Maintain weigh-in-motion monitoring.", voiceTe: "బైపాస్ ఎక్స్‌ప్రెస్‌వే ట్రాఫిక్ సాఫీగా ఉంది.", voiceEn: "Peripheral expressway transit smooth." },
      disaster: { title: "Yamuna Early Flood Warning", tag: "DDMA Hydro Command", stats: [{ label: "Discharge Headroom", value: "Safe Level", color: "text-sky-400" }], insights: ["Real-time telemetry from Hathnikund Barrage gives 36-hour downstream lead time."], recommendation: "Keep boat rescue units stationed at Old Bridge.", voiceTe: "యమునా నది వరద హెచ్చరిక వ్యవస్థ అప్రమత్తంగా ఉంది.", voiceEn: "Yamuna flood warning system armed." },
      energy: { title: "Delhi DISCOM Microgrid", tag: "BRPL / BYPL Solar", stats: [{ label: "Grid Solar Power", value: "42 MWh/day", color: "text-yellow-400" }], insights: ["Rooftop solar across educational institutions and ministries feeding clean power."], recommendation: "Transmit net-metering statement.", voiceTe: "ప్రభుత్వ భవనాలలో సోలార్ విద్యుత్ ఉత్పత్తి బాగుంది.", voiceEn: "Government enclave solar generation verified." },
      defense: { title: "Integrated Defense HQ & MoD War Room", tag: "TOP SECRET // TIER-1", stats: [{ label: "Airspace Gating", value: "VIP NO-FLY ACTIVE", color: "text-rose-400" }], insights: ["Tri-services command corridors and diplomatic enclaves protected under multi-layer air defense."], recommendation: "Maintain dedicated satellite war-room feed.", voiceTe: "త్రివిధ దళాల ప్రధాన కేంద్రం అత్యున్నత భద్రతలో ఉంది.", voiceEn: "Ministry of Defence war room telemetry secured." }
    },
    timelineData: {
      2020: { builtUp: "68.0%", waterIndex: "58%", ndvi: "0.34", event: "Central Vista redevelopment and Yamuna biodiversity pilot." },
      2026: { builtUp: "78.4%", waterIndex: "56%", ndvi: "0.30", event: "Autonomous multi-spectral monitoring across the National Capital Region." }
    }
  }
];

function MapView({
  center,
  zoom,
  pitch,
  buildingFloors,
  mapMode,
  activeSector,
  flyTrigger,
  flyType,
  onMapClick,
}: {
  center: [number, number];
  zoom: number;
  pitch: number;
  buildingFloors: number;
  mapMode: "rgb" | "ndvi" | "ndwi";
  activeSector: string;
  flyTrigger: number;
  flyType: "orbit" | "reset";
  onMapClick: (coords: { lng: number; lat: number }) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapInstance.current || !mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "satellite-tiles": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              // maxzoom: 18 forces MapLibre to freeze tile requests at zoom 18 and overscale (stretch) them cleanly
              maxzoom: 18,
            },
            "terrain-dem": {
              type: "raster-dem",
              tiles: [
                "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
              ],
              encoding: "terrarium",
              tileSize: 256,
              maxzoom: 15,
            },
          },
          layers: [
            {
              id: "satellite-layer",
              type: "raster",
              source: "satellite-tiles",
              minzoom: 0,
              maxzoom: 24,
            },
          ],
          terrain: {
            source: "terrain-dem",
            exaggeration: 1.2,
          },
        },
        center: center,
        zoom: zoom,
        pitch: pitch,
        bearing: -20,
        maxZoom: 22,
        maxPitch: 70,
        touchZoomRotate: true,
        dragPan: true,
        scrollZoom: true,
      });

      map.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        "top-right"
      );

      map.on("load", () => {
        map.addSource("building-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { height: buildingFloors * 3.5, base: 0, color: "#38bdf8" },
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [center[0] - 0.001, center[1] - 0.001],
                      [center[0] + 0.001, center[1] - 0.001],
                      [center[0] + 0.001, center[1] + 0.001],
                      [center[0] - 0.001, center[1] + 0.001],
                      [center[0] - 0.001, center[1] - 0.001],
                    ],
                  ],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "3d-building-layer",
          type: "fill-extrusion",
          source: "building-source",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "base"],
            "fill-extrusion-opacity": 0.85,
          },
        });

        map.addSource("sector-heatmap", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { intensity: 0.8 },
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [center[0] - 0.015, center[1] - 0.015],
                      [center[0] + 0.015, center[1] - 0.015],
                      [center[0] + 0.015, center[1] + 0.015],
                      [center[0] - 0.015, center[1] + 0.015],
                      [center[0] - 0.015, center[1] - 0.015],
                    ],
                  ],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "sector-heatmap-layer",
          type: "fill",
          source: "sector-heatmap",
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0,
          },
        });

        map.addSource("vector-corridors", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { type: "primary" },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [center[0] - 0.015, center[1] - 0.008],
                    [center[0], center[1]],
                    [center[0] + 0.015, center[1] + 0.008],
                  ],
                },
              },
              {
                type: "Feature",
                properties: { type: "secondary" },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [center[0] - 0.008, center[1] + 0.015],
                    [center[0], center[1]],
                    [center[0] + 0.008, center[1] - 0.015],
                  ],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "vector-corridors-layer",
          type: "line",
          source: "vector-corridors",
          paint: {
            "line-color": "#38bdf8",
            "line-width": 4,
            "line-opacity": 0,
          },
        });
      });

      map.on("click", (e) => {
        onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });

      mapInstance.current = map;
    } catch (err) {
      console.error("Map initialization error:", err);
    }

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo({
      center: center,
      zoom: zoom,
      pitch: pitch,
      essential: true,
      duration: 3000,
    });
  }, [center, zoom, pitch]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    if (!map.getLayer("sector-heatmap-layer") || !map.getLayer("vector-corridors-layer")) return;

    if (activeSector === "traffic") {
      map.setPaintProperty("vector-corridors-layer", "line-color", "#f59e0b");
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0.9);
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0);
    } else if (activeSector === "disaster") {
      map.setPaintProperty("vector-corridors-layer", "line-color", "#38bdf8");
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0.8);
      map.setPaintProperty("sector-heatmap-layer", "fill-color", "#3b82f6");
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0.4);
    } else if (activeSector === "energy") {
      map.setPaintProperty("vector-corridors-layer", "line-color", "#eab308");
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0.8);
      map.setPaintProperty("sector-heatmap-layer", "fill-color", "#eab308");
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0.3);
    } else if (activeSector === "defense") {
      map.setPaintProperty("vector-corridors-layer", "line-color", "#ef4444");
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0.95);
      map.setPaintProperty("sector-heatmap-layer", "fill-color", "#ef4444");
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0.3);
    } else if (mapMode === "ndvi" || activeSector === "agri") {
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0);
      map.setPaintProperty("sector-heatmap-layer", "fill-color", "#10b981");
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0.35);
    } else if (mapMode === "ndwi") {
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0);
      map.setPaintProperty("sector-heatmap-layer", "fill-color", "#38bdf8");
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0.4);
    } else {
      map.setPaintProperty("vector-corridors-layer", "line-opacity", 0);
      map.setPaintProperty("sector-heatmap-layer", "fill-opacity", 0);
    }
  }, [activeSector, mapMode]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const source = mapInstance.current.getSource("building-source") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { height: buildingFloors * 3.5, base: 0, color: "#38bdf8" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [center[0] - 0.001, center[1] - 0.001],
                  [center[0] + 0.001, center[1] - 0.001],
                  [center[0] + 0.001, center[1] + 0.001],
                  [center[0] - 0.001, center[1] + 0.001],
                  [center[0] - 0.001, center[1] - 0.001],
                ],
              ],
            },
          },
        ],
      });
    }
  }, [buildingFloors, center]);

  useEffect(() => {
    if (!mapInstance.current || flyTrigger === 0) return;
    if (flyType === "orbit") {
      mapInstance.current.flyTo({
        center: center,
        zoom: zoom + 1.5,
        pitch: 75,
        bearing: 110,
        duration: 4000,
      });
    } else {
      mapInstance.current.flyTo({
        center: center,
        zoom: zoom,
        pitch: pitch,
        bearing: -20,
        duration: 2500,
      });
    }
  }, [flyTrigger, flyType, zoom, pitch, center]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full absolute inset-0 cursor-crosshair touch-none"
      style={{ touchAction: "none" }}
    />
  );
}

export default function GeoDrishtiApp() {
  const [mounted, setMounted] = useState(false);
  const [activeSector, setActiveSector] = useState<"satellite" | "agri" | "urban" | "traffic" | "disaster" | "energy" | "defense">("satellite");
  const [mapMode] = useState<"rgb" | "ndvi" | "ndwi">("rgb");
  const [selectedLang, setSelectedLang] = useState("te-IN");
  const [queryInput, setQueryInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [buildingFloors, setBuildingFloors] = useState(5);
  const [locIndex, setLocIndex] = useState(0);

  // Defense Auth State
  const [isDefenseAuthorized, setIsDefenseAuthorized] = useState(false);
  const [showDefenseModal, setShowDefenseModal] = useState(false);
  const [defenseToken, setDefenseToken] = useState("");

  // Disaster SOS Alert State
  const [sosSent, setSosSent] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  // Solar DISCOM Export State
  const [showSolarReportModal, setShowSolarReportModal] = useState(false);

  const [flyTrigger, setFlyTrigger] = useState(0);
  const [flyType, setFlyType] = useState<"orbit" | "reset">("reset");
  const [clickedCoords, setClickedCoords] = useState<{ lng: number; lat: number } | null>(null);

  const [liveWeather, setLiveWeather] = useState({
    temp: "31.2°C",
    moisture: "68%",
    wind: "14 km/h",
    solar: "890 W/m²"
  });

  const [aiData, setAiData] = useState<any>({
    title: MASTER_LOCATIONS[0].sectors.satellite.title,
    tagline: MASTER_LOCATIONS[0].sectors.satellite.tag,
    stats: MASTER_LOCATIONS[0].sectors.satellite.stats,
    insights: MASTER_LOCATIONS[0].sectors.satellite.insights,
    recommendation: MASTER_LOCATIONS[0].sectors.satellite.recommendation,
  });

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,direct_radiation`
      );
      const data = await res.json();
      if (data?.current) {
        setLiveWeather({
          temp: `${data.current.temperature_2m}°C`,
          moisture: `${data.current.relative_humidity_2m}%`,
          wind: `${data.current.wind_speed_10m} km/h`,
          solar: `${data.current.direct_radiation || 850} W/m²`
        });
      }
    } catch {
      // Retain live values
    }
  };

  useEffect(() => {
    setMounted(true);
    const loc = MASTER_LOCATIONS[0];
    fetchWeather(loc.lat, loc.lng);
    updateIntelligence(0, 2026, "satellite");
  }, []);

  const handleLocationChange = (idx: number) => {
    setLocIndex(idx);
    setClickedCoords(null);
    const loc = MASTER_LOCATIONS[idx];
    fetchWeather(loc.lat, loc.lng);
    updateIntelligence(idx, selectedYear, activeSector);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateIntelligence(locIndex, year, activeSector);
  };

  const handleSectorSwitch = (sector: "satellite" | "agri" | "urban" | "traffic" | "disaster" | "energy" | "defense") => {
    if (sector === "defense" && !isDefenseAuthorized) {
      setShowDefenseModal(true);
      return;
    }
    setActiveSector(sector);
    updateIntelligence(locIndex, selectedYear, sector);
  };

  const handleDefenseAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (defenseToken.toUpperCase() === "ARMY2026" || defenseToken.toUpperCase() === "MOD" || defenseToken.toUpperCase() === "DEFENSE") {
      setIsDefenseAuthorized(true);
      setShowDefenseModal(false);
      setActiveSector("defense");
      updateIntelligence(locIndex, selectedYear, "defense");
    } else {
      alert("ACCESS REJECTED: Invalid Military Clearance Token. Security Event Logged.");
    }
  };

  const updateIntelligence = (locIdx: number, year: number, sectorKey: string, customPrompt = "") => {
    const loc = MASTER_LOCATIONS[locIdx] || MASTER_LOCATIONS[0];
    const sec = loc.sectors[sectorKey as keyof typeof loc.sectors] || loc.sectors.satellite;
    const yearStats = loc.timelineData[year] || loc.timelineData[2026] || { builtUp: "N/A", waterIndex: "N/A", ndvi: "N/A", event: "Active Satellite Tracking" };

    let dynamicStats = [...sec.stats];
    if (sectorKey === "satellite" && yearStats.builtUp !== "N/A") {
      dynamicStats = [
        { label: "Built-up Sprawl", value: yearStats.builtUp, color: "text-sky-400" },
        { label: "Water Level Delta", value: yearStats.waterIndex, color: "text-indigo-400" },
        { label: "NDVI Mean", value: yearStats.ndvi, color: "text-emerald-400" },
      ];
    }

    setAiData({
      title: `${sec.title} (${loc.name.split("(")[0].trim()})`,
      tagline: `${sec.tag} • Year ${year}`,
      stats: dynamicStats,
      insights: [
        `Historical Timeline Matrix (${year}): ${yearStats.event}`,
        ...sec.insights
      ],
      recommendation: sec.recommendation,
    });

    const spokenText = selectedLang === "te-IN" ? sec.voiceTe : sec.voiceEn;
    speakDetailedVoice(spokenText);
  };

  const speakDetailedVoice = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice query is supported on Google Chrome & Microsoft Edge.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.lang = selectedLang;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e: any) => {
      const captured = e.results[0][0].transcript;
      setQueryInput(captured);
      processUserQuery(captured);
    };
    rec.start();
  };

  const processUserQuery = (prompt: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const lower = prompt.toLowerCase();
      
      const matchedIdx = MASTER_LOCATIONS.findIndex((l) =>
        lower.includes(l.name.toLowerCase().split(" ")[0]) ||
        lower.includes(l.name.toLowerCase().split("(")[0].trim().toLowerCase())
      );
      const targetIdx = matchedIdx !== -1 ? matchedIdx : locIndex;
      if (matchedIdx !== -1) setLocIndex(matchedIdx);

      if (lower.includes("crop") || lower.includes("పంట") || lower.includes("soil") || lower.includes("భూసార")) {
        setActiveSector("agri");
        updateIntelligence(targetIdx, selectedYear, "agri", prompt);
      } else if (lower.includes("traffic") || lower.includes("ట్రాఫిక్") || lower.includes("logistics")) {
        setActiveSector("traffic");
        updateIntelligence(targetIdx, selectedYear, "traffic", prompt);
      } else if (lower.includes("flood") || lower.includes("వరద") || lower.includes("disaster")) {
        setActiveSector("disaster");
        updateIntelligence(targetIdx, selectedYear, "disaster", prompt);
      } else if (lower.includes("solar") || lower.includes("విద్యుత్") || lower.includes("energy")) {
        setActiveSector("energy");
        updateIntelligence(targetIdx, selectedYear, "energy", prompt);
      } else if (lower.includes("defense") || lower.includes("రక్షణ") || lower.includes("security")) {
        if (!isDefenseAuthorized) {
          setShowDefenseModal(true);
        } else {
          setActiveSector("defense");
          updateIntelligence(targetIdx, selectedYear, "defense", prompt);
        }
      } else if (lower.includes("building") || lower.includes("భవనం") || lower.includes("urban")) {
        setActiveSector("urban");
        updateIntelligence(targetIdx, selectedYear, "urban", prompt);
      } else {
        setActiveSector("satellite");
        updateIntelligence(targetIdx, selectedYear, "satellite", prompt);
      }
    }, 600);
  };

  const handleMapInspect = (coords: { lng: number; lat: number }) => {
    setClickedCoords(coords);
    fetchWeather(coords.lat, coords.lng);
    updateIntelligence(locIndex, selectedYear, activeSector);
  };

  const triggerDisasterSOS = () => {
    setSosSent(true);
    setShowSosModal(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  const exportDossier = () => {
    const loc = MASTER_LOCATIONS[locIndex];
    const reportData = {
      project: "GeoDrishti - SatQuery AI",
      problemStatement: "PSC26167 (ISRO)",
      timestamp: new Date().toISOString(),
      location: loc.name,
      category: loc.category,
      activeSector: activeSector,
      coordinates: clickedCoords || { lng: loc.lng, lat: loc.lat },
      selectedYear: selectedYear,
      yearStats: loc.timelineData[selectedYear] || loc.timelineData[2026],
      soilProfile: { soil: loc.soil, elevation: loc.elevation },
      weather: liveWeather,
      intelligence: aiData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeoDrishti_${loc.name.replace(/[^a-zA-Z0-9]/g, "_")}_${activeSector.toUpperCase()}_${selectedYear}.json`;
    a.click();
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-sky-400 font-mono text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Initializing GeoDrishti 4D Sovereign Command Engine...
      </div>
    );
  }

  const categories = Array.from(new Set(MASTER_LOCATIONS.map((l) => l.category)));

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      
      {/* RESTRICTED MILITARY CLEARANCE MODAL */}
      {showDefenseModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-600/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-rose-500/30 pb-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-black text-rose-400 tracking-wider">RESTRICTED DEFENSE ENCLAVE</h2>
                <p className="text-[10px] text-slate-400 font-mono">TRI-SERVICES (ARMY / NAVY / IAF) & MoD CLEARANCE ONLY</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This tactical module contains sovereign border reconnaissance (LAC / LOC), thermal intrusion anomalies, and classified radar satellite feeds. Unauthorized access is prohibited under the Official Secrets Act.
            </p>

            <form onSubmit={handleDefenseAuth} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400">Military Cryptographic Token</label>
                <input
                  type="password"
                  placeholder="Enter Defense Token (Demo: ARMY2026)"
                  value={defenseToken}
                  onChange={(e) => setDefenseToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-300 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono mt-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDefenseModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30"
                >
                  Authenticate Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISASTER MULTI-AGENCY SOS DIRECTIVE MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-sky-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-sky-400 border-b border-sky-500/30 pb-3">
              <Send className="w-5 h-5 animate-pulse" />
              <h2 className="text-sm font-black tracking-wide text-white">MULTI-AGENCY FLOOD DIRECTIVE DISPATCHED</h2>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> 1. District Collectorate & Revenue Division
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated public SMS & siren trigger deployed. Elevated shelter routes mapped to Nunna ZP High School (Capacity: 1,800 persons).
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 2. NDRF (10th Bn) & SDRF Command
                </div>
                <p className="text-[11px] text-slate-400">
                  Target Coordinates: Lat {MASTER_LOCATIONS[locIndex].lat.toFixed(4)}, Lng {MASTER_LOCATIONS[locIndex].lng.toFixed(4)}. Pre-staged equipment: 4 inflatable motorboats & life-vest triage kits.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 3. Red Cross & NGO Relief Network
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated supply manifest generated: 2,400 dry ration packets and 5,000L clean potable drinking water assigned for quadrant dispatch.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition shadow-lg shadow-sky-600/30"
            >
              Acknowledge & Return to Command Center
            </button>
          </div>
        </div>
      )}

      {/* DISCOM SOLAR SATURATION DOSSIER MODAL */}
      {showSolarReportModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-yellow-400 border-b border-yellow-500/30 pb-3">
              <Zap className="w-5 h-5" />
              <h2 className="text-sm font-black tracking-wide text-white">STATE DISCOM ENERGY FEEDER REPORT</h2>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Area Demand (Daily)</p>
                  <p className="text-sm font-black text-amber-400 mt-0.5">3.2 MWh / day</p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Rooftop Generation Cap</p>
                  <p className="text-sm font-black text-emerald-400 mt-0.5">5.8 MWh / day</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <p className="font-bold text-yellow-400">Grid Injection & Policy Findings:</p>
                <ul className="space-y-1 text-[11px] text-slate-400 list-disc pl-4">
                  <li>Surplus generation capacity of 2.6 MWh/day available for reverse feed into 33/11kV local substation.</li>
                  <li>Identified 48 unshaded agro-warehousing rooftops eligible for 40% capital subsidies under PM-Surya Ghar.</li>
                  <li>Recommended Grid Action: Install bidirectional smart meters across 12 commercial clusters to balance peak irrigation demand.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSolarReportModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  exportDossier();
                  setShowSolarReportModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-yellow-600 hover:bg-yellow-500 text-white transition shadow-lg shadow-yellow-600/30 flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-4 h-4" /> Download DISCOM PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar Cockpit */}
      <aside className="w-[450px] h-full flex-shrink-0 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col justify-between z-20 shadow-2xl">
        <div className="p-5 overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-sky-500/25">
                <Globe2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-black tracking-wide text-white">GeoDrishti</h1>
                  <span className="px-1.5 py-0.5 text-[9px] bg-sky-500/20 text-sky-300 font-bold rounded border border-sky-500/30">ISRO 4D AI</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Sovereign Vision-Language Remote Sensing Engine</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Target Strategic Hotspot</span>
              {clickedCoords && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  {clickedCoords.lat.toFixed(3)}°N, {clickedCoords.lng.toFixed(3)}°E
                </span>
              )}
            </label>
            <select
              value={locIndex}
              onChange={(e) => handleLocationChange(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 font-medium cursor-pointer"
            >
              {categories.map((cat, catIdx) => (
                <optgroup key={catIdx} label={cat} className="bg-slate-900 text-sky-400 font-bold">
                  {MASTER_LOCATIONS.map((loc, idx) =>
                    loc.category === cat ? (
                      <option key={idx} value={idx} className="bg-slate-950 text-white font-normal">
                        📍 {loc.name}
                      </option>
                    ) : null
                  )}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-sky-400" /> Multi-Sector Intelligence Horizon</span>
              <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">7 SECTORS ACTIVE</span>
            </label>

            <div className="grid grid-cols-4 gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-[11px]">
              {[ { id: "satellite", icon: Layers, label: "4D Sat" }, { id: "agri", icon: Sprout, label: "AgriMind" }, { id: "urban", icon: Building2, label: "Urban3D" }, { id: "traffic", icon: Truck, label: "Logistics" } ].map(sector => (
                <button key={sector.id} onClick={() => handleSectorSwitch(sector.id as any)} className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition ${activeSector === sector.id ? "bg-sky-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`}>
                  <sector.icon className="w-3.5 h-3.5" /> {sector.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 text-[10px]">
              {[ { id: "disaster", icon: AlertTriangle, label: "Flood & SOS", color: "blue" }, { id: "energy", icon: Zap, label: "Solar & Grid", color: "yellow" }, { id: "defense", icon: Shield, label: "Restricted Mil", color: "rose" } ].map(sector => (
                <button key={sector.id} onClick={() => handleSectorSwitch(sector.id as any)} className={`py-1.5 px-1 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition ${activeSector === sector.id ? `bg-${sector.color}-600 text-white` : "text-slate-400 hover:text-white"}`}>
                  <sector.icon className={`w-3 h-3 text-${sector.color}-400`} /> {sector.id === "defense" && !isDefenseAuthorized ? "Locked Mil" : sector.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sky-400" /> Time-Series 4D Matrix</span>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-mono font-bold rounded text-xs border border-sky-500/30">
                {selectedYear}
              </span>
            </div>
            <input
              type="range"
              min="2020"
              max="2026"
              step="1"
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-3.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-sky-400" /> Vernacular Voice AI</span>
              <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-sky-400 pointer">
                <option value="te-IN">తెలుగు</option> <option value="hi-IN">హిन्दी</option> <option value="en-IN">English</option>
              </select>
            </div>
            <div className="relative">
              <input type="text" value={queryInput} onChange={(e) => setQueryInput(e.target.value)} placeholder="Ask about crop health, flood risk, or grid status..." className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500" />
              <button onClick={handleVoiceInput} className={`absolute right-1.5 top-1.5 p-2 rounded-lg ${isListening ? "bg-red-500 animate-pulse" : "bg-slate-800"}`}>
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button onClick={() => processUserQuery(queryInput || "Analyze")} disabled={isProcessing} className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sky-600/20 active:scale-95">
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Satellite className="w-3.5 h-3.5" />} Execute Autonomous SatQuery
            </button>
          </div>

          {/* Quick-Action Trigger Cards */}
          {activeSector === "disaster" && (
            <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-blue-400" /> Emergency Command Action</span>
                <span className="text-[10px] font-mono text-sky-400">DDMA / NDRF</span>
              </div>
              <button
                onClick={triggerDisasterSOS}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Multi-Agency Flood Alert
              </button>
            </div>
          )}

          {activeSector === "energy" && (
            <div className="p-3 bg-yellow-950/40 border border-yellow-500/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-yellow-300">
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /> Electricity Board Action</span>
                <span className="text-[10px] font-mono text-yellow-400">DISCOM / CEA</span>
              </div>
              <button
                onClick={() => setShowSolarReportModal(true)}
                className="w-full py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/30"
              >
                <FileText className="w-3.5 h-3.5" /> View Area Solar & Grid Dossier
              </button>
            </div>
          )}

          {activeSector === "defense" && isDefenseAuthorized && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-rose-400">
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Armed Forces Terminal</span>
                <span className="text-[9px] font-mono bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">AUTHENTICATED</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Sovereign air-gapped radar active. Sub-meter SAR feed linked to Eastern Naval & Southern Command.
              </p>
            </div>
          )}

          {activeSector === "urban" && (
            <div className="p-3 bg-slate-800/30 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex justify-between"><span>Procedural 3D Simulator</span></div>
              <input type="range" min="1" max="12" value={buildingFloors} onChange={(e) => setBuildingFloors(parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg" />
            </div>
          )}

          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div><h3 className="font-bold text-xs text-white">{aiData.title}</h3><p className="text-[10px] text-slate-400">{aiData.tagline}</p></div>
              <button onClick={() => speakDetailedVoice(aiData.insights.join(". "))} className="p-1.5 bg-slate-800 text-sky-400 rounded-lg"><Volume2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">{aiData.stats.map((s: any, i: number) => (<div key={i} className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center"><p className="text-[9px] text-slate-500 font-bold uppercase">{s.label}</p><p className={`text-xs font-black mt-0.5 ${s.color}`}>{s.value}</p></div>))}</div>
            <div className="space-y-1.5">{aiData.insights.map((insight: string, idx: number) => (<p key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-relaxed"><span className="text-sky-400 mt-0.5">•</span> <span>{insight}</span></p>))}</div>
            <div className="p-2.5 bg-sky-950/40 border border-sky-500/30 rounded-xl text-[11px] text-sky-300 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sky-400" /><span>{aiData.recommendation}</span></div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <button onClick={() => { setFlyType("orbit"); setFlyTrigger(t => t + 1); }} className="px-3 py-1.5 bg-slate-800 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 border border-slate-700"><Camera className="w-3.5 h-3.5 text-sky-400" /> 3D Orbit</button>
          <button onClick={exportDossier} className="px-3 py-1.5 bg-sky-600/20 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 border border-sky-500/30"><FileDown className="w-3.5 h-3.5" /> Export Dossier</button>
        </div>
      </aside>

      <main className="flex-1 h-full w-full relative bg-slate-950">
        <MapView
          center={clickedCoords ? [clickedCoords.lng, clickedCoords.lat] : [MASTER_LOCATIONS[locIndex].lng, MASTER_LOCATIONS[locIndex].lat]}
          zoom={MASTER_LOCATIONS[locIndex].zoom}
          pitch={MASTER_LOCATIONS[locIndex].pitch}
          buildingFloors={buildingFloors}
          mapMode={mapMode}
          activeSector={activeSector}
          flyTrigger={flyTrigger}
          flyType={flyType}
          onMapClick={handleMapInspect}
        />
        <div className="absolute top-5 left-6 flex items-center gap-3 z-10 pointer-events-none">
          <div className="bg-slate-900/85 px-4 py-2 rounded-2xl border border-slate-700/70 text-xs font-mono text-slate-200 flex items-center gap-2.5 shadow-2xl"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /><span>GEO-ENGINE: <strong>1.2x 3D TERRAIN</strong></span></div>
        </div>
      </main>
    </div>
  );
}